import z from "zod";
import { productsDefectSchema } from "./productsDefect.schema.js";

const createProductsDefectSchema = z.object({
  nombre: productsDefectSchema.nombre,
  descripcion: productsDefectSchema.descripcion,
});

const updateProductsDefectSchema = z.object({
  idProductDefect: productsDefectSchema.idProductDefect,
  creatorAcceso: productsDefectSchema.creatorAcceso.optional(),
  nombre: productsDefectSchema.nombre.optional(),
  descripcion: productsDefectSchema.descripcion.optional(),
  fechaCreacion: productsDefectSchema.fechaCreacion.optional(),
});

export const createProductsDefectValidator = (object: unknown) =>
  createProductsDefectSchema.safeParse(object);

export const updateProductsDefectValidator = (object: unknown) =>
  updateProductsDefectSchema.safeParse(object);
