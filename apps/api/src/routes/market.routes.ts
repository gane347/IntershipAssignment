import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireSeller } from "../core/auth.js";
import { marketService } from "../services/market.service.js";
import { checkoutService } from "../services/checkout.service.js";

const gameIdSchema = z.uuid();
const gameSchema = z.object({
  name: z.string().trim().min(1).max(150),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  region: z.string().trim().min(1).max(50),
  platform: z.string().trim().min(1).max(50),
});
const cartSchema = z.object({
  sellerId: z.uuid(),
  quantity: z.number().int().min(1).max(99).default(1),
});

export const marketRouter = Router();

function serializeGame(game: {
  id: string;
  name: string;
  region: string;
  platform: string;
  createdAt: Date;
  digitalKeyEncrypted: string;
  sellers: { price: { toString(): string }; seller: { id: string; username: string } }[];
}) {
  const sellers = game.sellers.map((seller) => ({ ...seller, price: seller.price.toString() }));
  const lowestPrice = sellers.reduce(
    (lowest, seller) => Math.min(lowest, Number(seller.price)),
    Number.POSITIVE_INFINITY,
  );
  return {
    ...game,
    sellers,
    lowestPrice: Number.isFinite(lowestPrice) ? lowestPrice.toFixed(2) : null,
  };
}

function serializeCartItem(item: {
  userId: string;
  gameId: string;
  sellerId: string;
  quantity: number;
  game: Parameters<typeof serializeGame>[0];
  sellerListing: { price: { toString(): string }; seller: { id: string; username: string } };
}) {
  return {
    ...item,
    game: serializeGame(item.game),
    price: item.sellerListing.price.toString(),
    seller: item.sellerListing.seller,
  };
}

marketRouter.get("/games", async (_req, res) => {
  const query = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(8),
  }).parse(_req.query);
  const result = await marketService.listGames(query.page, query.pageSize);
  res.json({
    ...result,
    items: result.items.map(serializeGame),
  });
});

marketRouter.get("/games/:gameId", async (req, res) => {
  const game = await marketService.getGame(gameIdSchema.parse(req.params.gameId));
  res.json(serializeGame(game));
});

marketRouter.post("/games", requireAuth, requireSeller, async (req, res) => {
  const game = await marketService.createGame(req.user!.id, gameSchema.parse(req.body));
  res.status(201).json({
    ...game,
    sellers: game.sellers,
  });
});

marketRouter.get("/wishlist", requireAuth, async (req, res) => {
  const wishlist = await marketService.getWishlist(req.user!.id);
  res.json(wishlist.map((item) => ({ ...item, game: serializeGame(item.game) })));
});

marketRouter.post("/wishlist/:gameId", requireAuth, async (req, res) => {
  const item = await marketService.addToWishlist(req.user!.id, gameIdSchema.parse(req.params.gameId));
  res.status(201).json({ ...item, game: serializeGame(item.game) });
});

marketRouter.delete("/wishlist/:gameId", requireAuth, async (req, res) => {
  await marketService.removeFromWishlist(req.user!.id, gameIdSchema.parse(req.params.gameId));
  res.status(204).send();
});

marketRouter.get("/cart", requireAuth, async (req, res) => {
  const cart = await marketService.getCart(req.user!.id);
  res.json(cart.map(serializeCartItem));
});

marketRouter.post("/cart/:gameId", requireAuth, async (req, res) => {
  const input = cartSchema.parse(req.body);
  const item = await marketService.addToCart(
    req.user!.id,
    gameIdSchema.parse(req.params.gameId),
    input.sellerId,
    input.quantity,
  );
  res.status(201).json(serializeCartItem(item));
});

marketRouter.delete("/cart/:gameId", requireAuth, async (req, res) => {
  const sellerId = z.uuid().parse(req.query.sellerId);
  await marketService.removeFromCart(req.user!.id, gameIdSchema.parse(req.params.gameId), sellerId);
  res.status(204).send();
});

marketRouter.post("/checkout", requireAuth, async (req, res) => {
  void req;
  const result = await checkoutService.complete(req.user!.id);
  res.json(result);
});
