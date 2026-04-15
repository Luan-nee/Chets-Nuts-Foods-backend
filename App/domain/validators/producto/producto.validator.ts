import z from "zod";
import { productoEnvioSchema } from "./producto.schema.js";

const createProductoSchema = z.object({
  idenvio: productoEnvioSchema.idenvio,
  nombreproducto: productoEnvioSchema.nombreproducto,
  observacion: productoEnvioSchema.observacion,
  peso: productoEnvioSchema.peso,
});

const updateProductoSchema = z.object({
  idenvio: productoEnvioSchema.idenvio.optional(),
  nombreproducto: productoEnvioSchema.nombreproducto.optional(),
  observacion: productoEnvioSchema.observacion,
  peso: productoEnvioSchema.peso.optional(),
});

export const createProductoValidator = (object: unknown) =>
  createProductoSchema.safeParse(object);

export const updateProductoValidator = (object: unknown) =>
  updateProductoSchema.safeParse(object);
