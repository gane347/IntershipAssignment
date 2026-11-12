import { z } from "zod";

export const itemSchema = z.object({ id: z.string(), name: z.string() });
export type Item = z.infer<typeof itemSchema>;

export const createItemSchema = z.object({ name: z.string().min(1).max(100) });
export type CreateItemInput = z.infer<typeof createItemSchema>;
