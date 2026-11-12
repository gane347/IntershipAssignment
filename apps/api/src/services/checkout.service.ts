import { randomUUID } from "node:crypto";
import { decryptDigitalKey } from "../core/digital-keys.js";
import { prisma } from "../core/db.js";
import { HttpError } from "../core/http.js";

export const checkoutService = {
  complete: async (userId: string) => {
    return prisma.$transaction(async (transaction) => {
      const cart = await transaction.cartItem.findMany({
        where: { userId },
        include: {
          game: {
            include: { sellers: { select: { price: true } } },
          },
          sellerListing: { select: { price: true } },
        },
      });

      if (cart.length === 0) {
        throw new HttpError(400, "Your cart is empty");
      }

      const items = cart.map((item) => {
        return {
          gameId: item.gameId,
          name: item.game.name,
          quantity: item.quantity,
          unitPrice: item.sellerListing.price.toString(),
          digitalKey: decryptDigitalKey(item.game.digitalKeyEncrypted),
        };
      });

      const total = items.reduce(
        (sum, item) => sum + Number(item.unitPrice) * item.quantity,
        0,
      );
      await transaction.cartItem.deleteMany({ where: { userId } });

      return {
        orderId: randomUUID(),
        status: "succeeded",
        total: total.toFixed(2),
        items,
      };
    });
  },
};
