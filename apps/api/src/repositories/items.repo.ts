import { prisma } from "../core/db.js";

export const itemsRepo = {
  list: () =>
    prisma.item.findMany({ orderBy: { createdAt: "desc" } }),

  find: (id: string) =>
    prisma.item.findUnique({ where: { id } }),

  create: (name: string) =>
    prisma.item.create({ data: { name } }),
};
