import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";

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

  addToCart: async (userId: string, gameId: string, quantity: number) => {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new HttpError(404, "Game not found");
    return prisma.cartItem.upsert({
      where: { userId_gameId: { userId, gameId } },
      create: { userId, gameId, quantity },
      update: { quantity: { increment: quantity } },
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

  removeFromCart: (userId: string, gameId: string) =>
    prisma.cartItem.deleteMany({ where: { userId, gameId } }),

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
      },
    }),
};
