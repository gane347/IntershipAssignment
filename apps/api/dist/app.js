import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { ZodError } from "zod";
import { env } from "./core/env.js";
import { HttpError } from "./core/http.js";
import { v1Router } from "./routes/index.js";
export function createApp() {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(express.json({ limit: "1mb" }));
    app.use(pinoHttp());
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/api/v1", v1Router);
    app.use((_req, res) => res.status(404).json({ error: "Not found" }));
    app.use((err, _req, res, _next) => {
        if (err instanceof ZodError) {
            return res.status(400).json({ error: "Validation failed", issues: err.issues });
        }
        if (err instanceof HttpError) {
            return res.status(err.status).json({ error: err.message });
        }
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    });
    return app;
}
