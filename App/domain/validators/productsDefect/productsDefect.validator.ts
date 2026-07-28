import z from "zod";
import { productsDefectSchema } from "./productsDefect.schema.js";

const createProductsDefectSchema = z.object({
  nombre: productsDefectSchema.nombre,
  descripcion: productsDefectSchema.descripcion,
  calidad: productsDefectSchema.calidad,
  calibre: productsDefectSchema.calibre,
});

const updateProductsDefectSchema = z.object({
  idProductDefect: productsDefectSchema.idProductDefect,
  nombre: productsDefectSchema.nombre.optional(),
  descripcion: productsDefectSchema.descripcion.optional(),
  calidad: productsDefectSchema.calidad.optional(),
  calibre: productsDefectSchema.calibre.optional(),
});

export const createProductsDefectValidator = (object: unknown) =>
  createProductsDefectSchema.safeParse(object);

export const updateProductsDefectValidator = (object: unknown) =>
  updateProductsDefectSchema.safeParse(object);
