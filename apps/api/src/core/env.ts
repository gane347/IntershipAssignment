import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(32),
  DIGITAL_KEY_ENCRYPTION_KEY: z.string().regex(/^[0-9a-fA-F]{64}$/, "DIGITAL_KEY_ENCRYPTION_KEY must be 32-byte hex"),
});

export const env = schema.parse(process.env);