import "dotenv/config";
import { z } from "zod";
const schema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().url(),
    CORS_ORIGIN: z.string().default("http://localhost:3000"),
});
export const env = schema.parse(process.env);
