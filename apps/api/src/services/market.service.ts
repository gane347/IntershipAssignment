import { randomUUID } from "node:crypto";
import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";
import { encryptDigitalKey } from "../core/digital-keys.js";

export const marketService = {
  listGames: async (options: {
    page: number;
    pageSize: number;
    search?: string;
    platform?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: "newest" | "name-asc" | "name-desc" | "price-asc" | "price-desc";
  }) => {
    const games = await prisma.game.findMany({
      where: {
        name: options.search ? { contains: options.search, mode: "insensitive" } : undefined,
        platform: options.platform
          ? options.platform === "PSN"
            ? { in: ["PSN", "PS5"] }
            : { equals: options.platform }
          : undefined,
        region: options.region ? { equals: options.region } : undefined,
        sellers: {
          some: {
            price: {
              gte: options.minPrice,
              lte: options.maxPrice,
            },
          },
        },
      },
      include: {
        sellers: {
          include: { seller: { select: { id: true, username: true } } },
        },
      },
    });

    const items = games
      .map((game) => ({
        game,
        lowestPrice: game.sellers.reduce(
          (lowest, seller) => Math.min(lowest, Number(seller.price)),
          Number.POSITIVE_INFINITY,
        ),
      }))
      .sort((left, right) => {
        switch (options.sort) {
          case "name-asc":
            return left.game.name.localeCompare(right.game.name);
          case "name-desc":
            return right.game.name.localeCompare(left.game.name);
          case "price-asc":
            return left.lowestPrice - right.lowestPrice;
          case "price-desc":
            return right.lowestPrice - left.lowestPrice;
          default:
            return right.game.createdAt.getTime() - left.game.createdAt.getTime();
        }
      })
      .slice((options.page - 1) * options.pageSize, options.page * options.pageSize)
      .map(({ game }) => game);

    const [platforms, regions] = await prisma.$transaction([
      prisma.game.findMany({ distinct: ["platform"], select: { platform: true }, orderBy: { platform: "asc" } }),
      prisma.game.findMany({ distinct: ["region"], select: { region: true }, orderBy: { region: "asc" } }),
    ]);

    return {
      items,
      total: games.length,
      page: options.page,
      pageSize: options.pageSize,
      totalPages: Math.ceil(games.length / options.pageSize),
      platforms: platforms.map(({ platform }) => platform),
      regions: regions.map(({ region }) => region),
    };
  },

  listFeaturedGames: async (kind: "bestsellers" | "best-deals", limit: number) => {
    const games = await prisma.game.findMany({
      include: {
        sellers: {
          include: { seller: { select: { id: true, username: true } } },
        },
      },
    });

    return games
      .sort((left, right) => {
        if (kind === "best-deals") {
          const leftPrice = Math.min(...left.sellers.map((seller) => Number(seller.price)));
          const rightPrice = Math.min(...right.sellers.map((seller) => Number(seller.price)));
          return leftPrice - rightPrice;
        }

        return right.sellers.length - left.sellers.length || right.createdAt.getTime() - left.createdAt.getTime();
      })
      .slice(0, limit);
  },

  getGame: async (gameId: string) => {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        sellers: {
          include: { seller: { select: { id: true, username: true } } },
          orderBy: { price: "asc" },
        },
      },
    });
    if (!game) throw new HttpError(404, "Game not found");
    return game;
  },

  createGame: async (
    sellerId: string,
    input: { name: string; price: string; region: string; platform: string },
  ) => {
    const game = await prisma.game.create({
      data: {
        name: input.name,
        region: input.region,
        platform: input.platform,
        digitalKeyEncrypted: encryptDigitalKey(`KEY-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`),
        sellers: { create: { sellerId, price: input.price } },
      },
      include: { sellers: { select: { sellerId: true, price: true } } },
    });
    return {
      ...game,
      sellers: game.sellers.map((seller) => ({ ...seller, price: seller.price.toString() })),
    };
  },

  addToWishlist: async (userId: string, gameId: string) => {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new HttpError(404, "Game not found");
    return prisma.wishlistItem.upsert({
      where: { userId_gameId: { userId, gameId } },
      create: { userId, gameId },
      update: {},
      include: {
        game: {
          include: {
            sellers: {
              include: { seller: { select: { id: true, username: true } } },
            },
          },
        },
      },
    });
  },

  removeFromWishlist: (userId: string, gameId: string) =>
    prisma.wishlistItem.deleteMany({ where: { userId, gameId } }),

  getWishlist: (userId: string) =>
    prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        game: {
          include: {
            sellers: {
              include: { seller: { select: { id: true, username: true } } },
            },
          },
        },
      },
    }),

  addToCart: async (userId: string, gameId: string, sellerId: string, quantity: number) => {
    const listing = await prisma.gameSeller.findUnique({
      where: { gameId_sellerId: { gameId, sellerId } },
    });
    if (!listing) throw new HttpError(404, "Seller listing not found");
    return prisma.cartItem.upsert({
      where: { userId_gameId_sellerId: { userId, gameId, sellerId } },
      create: { userId, gameId, sellerId, quantity },
      update: { quantity: { increment: quantity } },
      include: {
        game: {
          include: {
            sellers: {
              include: { seller: { select: { id: true, username: true } } },
            },
          },
        },
        sellerListing: { include: { seller: { select: { id: true, username: true } } } },
      },
    });
  },

  removeFromCart: (userId: string, gameId: string, sellerId: string) =>
    prisma.cartItem.deleteMany({ where: { userId, gameId, sellerId } }),

  getCart: (userId: string) =>
    prisma.cartItem.findMany({
      where: { userId },
      include: {
        game: {
          include: {
            sellers: {
              include: { seller: { select: { id: true, username: true } } },
            },
          },
        },
        sellerListing: { include: { seller: { select: { id: true, username: true } } } },
      },
    }),
};
