import { prisma } from "../core/db.js";
export const itemsRepo = {
    list: () => prisma.item.findMany({ orderBy: { createdAt: "desc" } }),
    find: (id) => prisma.item.findUnique({ where: { id } }),
    create: (name) => prisma.item.create({ data: { name } }),
};
