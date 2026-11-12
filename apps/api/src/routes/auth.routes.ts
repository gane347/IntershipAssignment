import { Router } from "express";
import { z } from "zod";
import { createAccessToken, requireAuth } from "../core/auth.js";
import { HttpError } from "../core/http.js";
import { authService } from "../services/auth.service.js";

const registerSchema = z.object({
  email: z.email(),
  username: z.string().trim().min(3).max(50),
  password: z.string().min(8).max(128),
  isSeller: z.boolean().default(false),
});

const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const input = registerSchema.parse(req.body);
  const user = await authService.register(input);
  res.status(201).json({ user, token: createAccessToken(user) });
});

authRouter.post("/login", async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await authService.authenticate(input.identifier, input.password);
  res.json({ user, token: createAccessToken(user) });
});

authRouter.post("/logout", requireAuth, (_req, res) => {
  res.status(204).send();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, "Authentication required");
  }
  const user = await authService.getPublicUser(req.user.id);
  if (!user) {
    throw new HttpError(401, "User not found");
  }
  res.json({ user });
});
