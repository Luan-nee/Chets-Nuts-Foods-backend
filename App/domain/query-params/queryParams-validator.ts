import z from "zod";
import { queryBaseSchema } from "./query-Schema.js";

export const queryEschemas = z.object({
  sortBy: queryBaseSchema.sortBy,
  filter: queryBaseSchema.filter,
  search: queryBaseSchema.search,
  order: queryBaseSchema.order,
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
