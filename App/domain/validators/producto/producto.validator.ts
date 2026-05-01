import z from "zod";
import { productoEnvioSchema } from "./producto.schema.js";

const createProductoSchema = z.object({
  nombreproducto: productoEnvioSchema.nombreproducto,
  observacion: productoEnvioSchema.observacion.optional(),
  pesounitario: productoEnvioSchema.pesounitario,
  cantidad: productoEnvioSchema.cantidad,
});

const updateProductoSchema = z.object({
  idenvio: productoEnvioSchema.idenvio.optional(),
  nombreproducto: productoEnvioSchema.nombreproducto.optional(),
  observacion: productoEnvioSchema.observacion,
  pesounitario: productoEnvioSchema.pesounitario.optional(),
  cantidad: productoEnvioSchema.cantidad.optional(),
});

export const createProductoValidator = (object: unknown) =>
  createProductoSchema.safeParse(object);

export const updateProductoValidator = (object: unknown) =>
  updateProductoSchema.safeParse(object);
