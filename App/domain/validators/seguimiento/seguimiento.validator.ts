import z from "zod";
import { seguimientoSchema } from "./seguimiento.schema.js";

// Schema para crear un nuevo seguimiento
const createSeguimientoSchema = z.object({
  idpaquete: seguimientoSchema.idpaquete,
  idcontrolestablecimiento: seguimientoSchema.idcontrolestablecimiento,
  latitud: seguimientoSchema.latitud,
  longitud: seguimientoSchema.longitud,
  direccion: seguimientoSchema.direccion,
  comentario: seguimientoSchema.comentario,
});

// Schema para actualizar un seguimiento
const updateSeguimientoSchema = z.object({
  idpaquete: seguimientoSchema.idpaquete.optional(),
  idcontrolestablecimiento: seguimientoSchema.idcontrolestablecimiento,
  latitud: seguimientoSchema.latitud,
  longitud: seguimientoSchema.longitud,
  direccion: seguimientoSchema.direccion,
  comentario: seguimientoSchema.comentario,
});

export const createSeguimientoValidator = (object: unknown) =>
  createSeguimientoSchema.safeParse(object);

export const updateSeguimientoValidator = (object: unknown) =>
  updateSeguimientoSchema.safeParse(object);

