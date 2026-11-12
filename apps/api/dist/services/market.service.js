import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";
export const marketService = {
    listGames: () => prisma.game.findMany({
        include: { sellers: { include: { seller: { select: { id: true, username: true } } } } },
        orderBy: { createdAt: "desc" },
    }),
    createGame: async (sellerId, input) => {
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
    addToWishlist: async (userId, gameId) => {
        const game = await prisma.game.findUnique({ where: { id: gameId } });
        if (!game)
            throw new HttpError(404, "Game not found");
        return prisma.wishlistItem.upsert({
            where: { userId_gameId: { userId, gameId } },
            create: { userId, gameId },
            update: {},
            include: { game: true },
        });
    },
    removeFromWishlist: (userId, gameId) => prisma.wishlistItem.deleteMany({ where: { userId, gameId } }),
    getWishlist: (userId) => prisma.wishlistItem.findMany({ where: { userId }, include: { game: true } }),
    addToCart: async (userId, gameId, quantity) => {
        const game = await prisma.game.findUnique({ where: { id: gameId } });
        if (!game)
            throw new HttpError(404, "Game not found");
        return prisma.cartItem.upsert({
            where: { userId_gameId: { userId, gameId } },
            create: { userId, gameId, quantity },
            update: { quantity: { increment: quantity } },
            include: { game: true },
        });
    },
    removeFromCart: (userId, gameId) => prisma.cartItem.deleteMany({ where: { userId, gameId } }),
    getCart: (userId) => prisma.cartItem.findMany({ where: { userId }, include: { game: true } }),
};
