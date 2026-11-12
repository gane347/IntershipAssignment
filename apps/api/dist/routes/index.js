import { Router } from "express";
import { itemsRouter } from "./items.routes.js";
export const v1Router = Router();
v1Router.use("/items", itemsRouter);
