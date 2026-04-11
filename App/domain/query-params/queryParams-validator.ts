import z from "zod";
import { paramsSchema, queryBaseSchema } from "./query-Schema.js";

export const queryEschemas = z.object({
  sortBy: queryBaseSchema.sortBy,
  filter: queryBaseSchema.filter,
  search: queryBaseSchema.search,
  order: queryBaseSchema.order,
  page: queryBaseSchema.page,
});

export const queryPage = z.object({
  page: queryBaseSchema.page,
});

export const queryValidator = (object: unknown) =>
  queryEschemas.safeParse(object);

/* 
Explicación de los Parámetros de Consulta
sort_by=name: Ordena los resultados por el campo name.
order=asc: Ordena los resultados en orden ascendente.
search=engine: Filtra los resultados que contienen la palabra "engine".
page_size=10: Define el tamaño de la página como 10 elementos.
*/

const ParamsNumericIDSchema = z.object({
  id: paramsSchema.numericId,
});

const ParamsPageSchema = z.object({
  page: queryBaseSchema.page,
});

export const ParamPageValidator = (object: unknown) =>
  ParamsPageSchema.safeParse(object);

export const ParamNumericIdValidator = (object: unknown) =>
  ParamsNumericIDSchema.safeParse(object);
