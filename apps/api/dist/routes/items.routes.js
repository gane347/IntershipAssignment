import { Router } from "express";
import { z } from "zod";
import { itemsService } from "../services/items.service.js";
export const itemsRouter = Router();
const idSchema = z.uuid();
const createSchema = z.object({ name: z.string().min(1).max(100) });
itemsRouter.get("/", (_req, res) => {
    res.json(itemsService.list());
});
itemsRouter.get("/:id", (req, res) => {
    res.json(itemsService.get(idSchema.parse(req.params.id)));
});
itemsRouter.post("/", (req, res) => {
    const body = createSchema.parse(req.body);
    res.status(201).json(itemsService.create(body.name));
});
