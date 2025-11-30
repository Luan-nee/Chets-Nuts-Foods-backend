import z from "zod";
import { queryBaseSchema } from "../../query-params/query-Schema.js";

export const queriesProductoSchema = z.object({
  sortBy: queryBaseSchema.sortBy,
  filter: queryBaseSchema.filter,
  order: queryBaseSchema.order,
  page: queryBaseSchema.page,
  search: queryBaseSchema.search,
});

export const queriesProductosValidator = (object: unknown) =>
  queriesProductoSchema.safeParse(object);
