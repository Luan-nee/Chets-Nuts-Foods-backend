import z from "zod";
import { accesoSchema } from "./acceso.schema.js";

// Schema para crear un nuevo acceso
const createAccesoSchema = z.object({
  idusuario: accesoSchema.idusuario,
  tipos: accesoSchema.tipos,
  correo: accesoSchema.correo,
  contra: accesoSchema.contra,
  estado: accesoSchema.estado,
});

// Schema para actualizar un acceso
const updateAccesoSchema = z.object({
  idusuario: accesoSchema.idusuario.optional(),
  tipos: accesoSchema.tipos.optional(),
  correo: accesoSchema.correo.optional(),
  contra: accesoSchema.contra.optional(),
  estado: accesoSchema.estado.optional(),
});

export const createAccesoValidator = (object: unknown) =>
  createAccesoSchema.safeParse(object);

export const updateAccesoValidator = (object: unknown) =>
  updateAccesoSchema.safeParse(object);

