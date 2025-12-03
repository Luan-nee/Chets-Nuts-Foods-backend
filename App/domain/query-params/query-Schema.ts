import z from "zod";
import { idTypeBaseSchema } from "../validators/id-type-schema.js";
import { defaultQueries, maxPageSize } from "../../consts.js";

export const paramsSchema = {
  numericId: idTypeBaseSchema.numericId,
};

export const queryBaseSchema = {
  search: z.coerce.string().trim().default(defaultQueries.search).optional(),
  sortBy: z.coerce.string().trim().default(defaultQueries.sort_by).optional(),
  filter: z.coerce.string().trim().default(defaultQueries.filter).optional(),
  order: z.coerce
    .string()
    .trim()
    .max(5)
    .default(defaultQueries.order)
    .optional(),
  page: z.coerce
    .number()
    .default(defaultQueries.page)
    .transform((valor) => {
      if (valor < 1) return 0;
      if (valor > maxPageSize) return maxPageSize;
      return valor;
    }),
};
