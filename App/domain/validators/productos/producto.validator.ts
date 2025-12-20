import z from "zod";
import { queryBaseSchema } from "../../query-params/query-Schema.js";
import { productosSchema } from "./productos.schema.js";

export const queriesProductoSchema = z.object({
  order: queryBaseSchema.order,
  page: queryBaseSchema.page,
  search: queryBaseSchema.search,
});

export const queriesProductosValidator = (object: unknown) =>
  queriesProductoSchema.safeParse(object);

const updateProductoSchema = z.object({
  sku: productosSchema.sku,
  nombre: productosSchema.nombre,
  stock_actual: productosSchema.stockActual,
  stock_minimo: productosSchema.stockMinimo,
  porcentaje_ganancia: productosSchema.porcentajeGananacia,
  precio_compra_proveedor: productosSchema.precioCompraProveedor,
  descripcion: productosSchema.descripcion,
});

export const updateProductsValidator = (object: unknown) =>
  updateProductoSchema.partial().safeParse(object);
