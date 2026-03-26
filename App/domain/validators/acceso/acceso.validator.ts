import z from "zod";
import { accesoSchema } from "./acceso.schema.js";

const createAccesoSchema = z.object({
  idusuario: accesoSchema.idusuario.optional(),
  tipos: accesoSchema.tipos,
  correo: accesoSchema.correo,
  password: accesoSchema.contra,
  estado: accesoSchema.estado,
});

const updateAccesoSchema = z.object({
  idacceso: accesoSchema.idacceso,
  tipos: accesoSchema.tipos.optional(),
  correo: accesoSchema.correo.optional(),
  password: accesoSchema.contra.optional(),
  estado: accesoSchema.estado.optional(),
});

export const createAccesoValidator = (object: unknown) =>
  createAccesoSchema.safeParse(object);

export const updateAccesoValidator = (object: unknown) =>
  updateAccesoSchema.safeParse(object);
