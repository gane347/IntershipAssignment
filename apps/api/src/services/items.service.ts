import { HttpError } from "../core/http.js";
import { itemsRepo } from "../repositories/items.repo.js";

export const itemsService = {
  list: () => itemsRepo.list(),

  get: async (id: string) => {
    const item = await itemsRepo.find(id);
    if (!item) throw new HttpError(404, "Item not found");
    return item;
  },

  create: (name: string) => itemsRepo.create(name),
};
