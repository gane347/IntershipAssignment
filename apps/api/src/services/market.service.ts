import { randomUUID } from "node:crypto";
import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";
import { encryptDigitalKey } from "../core/digital-keys.js";

export const marketService = {
  listGames: async (page: number, pageSize: number) => {
    const [items, total] = await prisma.$transaction([
      prisma.game.findMany({
        include: {
          sellers: {
            include: { seller: { select: { id: true, username: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.game.count(),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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
        digitalKeyEncrypted: encryptDigitalKey(`ENEBA-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`),
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
