import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";

export const marketService = {
  listGames: async (page: number, pageSize: number) => {
    const [items, total] = await prisma.$transaction([
      prisma.game.findMany({
        include: { sellers: { include: { seller: { select: { id: true, username: true } } } } },
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

  createGame: async (
    sellerId: string,
    input: { name: string; price: string; region: string; platform: string },
  ) => {
    const game = await prisma.game.create({
      data: {
        name: input.name,
        price: input.price,
        region: input.region,
        platform: input.platform,
        sellers: { create: { sellerId } },
      },
      include: { sellers: { select: { sellerId: true } } },
    });
    return { ...game, price: game.price.toString() };
  },

  addToWishlist: async (userId: string, gameId: string) => {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new HttpError(404, "Game not found");
    return prisma.wishlistItem.upsert({
      where: { userId_gameId: { userId, gameId } },
      create: { userId, gameId },
      update: {},
      include: { game: true },
    });
  },

  removeFromWishlist: (userId: string, gameId: string) =>
    prisma.wishlistItem.deleteMany({ where: { userId, gameId } }),

  getWishlist: (userId: string) =>
    prisma.wishlistItem.findMany({ where: { userId }, include: { game: true } }),

  addToCart: async (userId: string, gameId: string, quantity: number) => {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new HttpError(404, "Game not found");
    return prisma.cartItem.upsert({
      where: { userId_gameId: { userId, gameId } },
      create: { userId, gameId, quantity },
      update: { quantity: { increment: quantity } },
      include: { game: true },
    });
  },

  removeFromCart: (userId: string, gameId: string) =>
    prisma.cartItem.deleteMany({ where: { userId, gameId } }),

  getCart: (userId: string) =>
    prisma.cartItem.findMany({ where: { userId }, include: { game: true } }),
};
