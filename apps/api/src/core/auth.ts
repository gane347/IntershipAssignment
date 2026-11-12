import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { HttpError } from "./http.js";

export type AuthUser = {
  id: string;
  isSeller: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function createAccessToken(user: AuthUser) {
  return jwt.sign({ isSeller: user.isSeller }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
  });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : undefined;

  if (!token) {
    return next(new HttpError(401, "Authentication required"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "string" || !payload.sub || typeof payload.isSeller !== "boolean") {
      throw new Error("Invalid token payload");
    }
    req.user = { id: payload.sub, isSeller: payload.isSeller };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

export function requireSeller(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isSeller) {
    return next(new HttpError(403, "Seller access required"));
  }
  return next();
}
