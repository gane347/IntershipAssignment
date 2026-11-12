import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireSeller } from "../core/auth.js";
import { marketService } from "../services/market.service.js";

const gameIdSchema = z.uuid();
const gameSchema = z.object({
  name: z.string().trim().min(1).max(150),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  region: z.string().trim().min(1).max(50),
  platform: z.string().trim().min(1).max(50),
});
const quantitySchema = z.object({ quantity: z.number().int().min(1).max(99).default(1) });

export const marketRouter = Router();

marketRouter.get("/games", async (_req, res) => {
  const query = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(8),
  }).parse(_req.query);
  const result = await marketService.listGames(query.page, query.pageSize);
  res.json({
    ...result,
    items: result.items.map((game) => ({ ...game, price: game.price.toString() })),
  });
});

marketRouter.post("/games", requireAuth, requireSeller, async (req, res) => {
  const game = await marketService.createGame(req.user!.id, gameSchema.parse(req.body));
  res.status(201).json(game);
});

marketRouter.get("/wishlist", requireAuth, async (req, res) => {
  const wishlist = await marketService.getWishlist(req.user!.id);
  res.json(wishlist.map((item) => ({ ...item, game: { ...item.game, price: item.game.price.toString() } })));
});

marketRouter.post("/wishlist/:gameId", requireAuth, async (req, res) => {
  const item = await marketService.addToWishlist(req.user!.id, gameIdSchema.parse(req.params.gameId));
  res.status(201).json({ ...item, game: { ...item.game, price: item.game.price.toString() } });
});

marketRouter.delete("/wishlist/:gameId", requireAuth, async (req, res) => {
  await marketService.removeFromWishlist(req.user!.id, gameIdSchema.parse(req.params.gameId));
  res.status(204).send();
});

marketRouter.get("/cart", requireAuth, async (req, res) => {
  const cart = await marketService.getCart(req.user!.id);
  res.json(cart.map((item) => ({ ...item, game: { ...item.game, price: item.game.price.toString() } })));
});

marketRouter.post("/cart/:gameId", requireAuth, async (req, res) => {
  const item = await marketService.addToCart(
    req.user!.id,
    gameIdSchema.parse(req.params.gameId),
    quantitySchema.parse(req.body).quantity,
  );
  res.status(201).json({ ...item, game: { ...item.game, price: item.game.price.toString() } });
});

marketRouter.delete("/cart/:gameId", requireAuth, async (req, res) => {
  await marketService.removeFromCart(req.user!.id, gameIdSchema.parse(req.params.gameId));
  res.status(204).send();
});
