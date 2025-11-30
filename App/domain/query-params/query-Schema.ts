import z from "zod";
import { idTypeBaseSchema } from "../validators/id-type-schema.js";
import { defaultQueries, maxPageSize } from "../../consts.js";

export const paramsSchema = {
  numericId: idTypeBaseSchema.numericId,
};

export const queryBaseSchema = {
  search: z.coerce.string().trim().default(defaultQueries.search),
  sortBy: z.coerce.string().trim().default(defaultQueries.sort_by),
  filter: z.coerce.string().trim().default(defaultQueries.filter),
  order: z.coerce.string().trim().default(defaultQueries.order),
  page: z.coerce
    .number()
    .default(defaultQueries.page)
    .transform((valor) => {
      if (valor < 1) return 1;
      if (valor > maxPageSize) return maxPageSize;
      return valor;
    }),
};
