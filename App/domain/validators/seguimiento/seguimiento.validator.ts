import z from "zod";
import { seguimientoSchema } from "./seguimiento.schema.js";

const createSeguimientoSchema = z.object({
  idcontrolestablecimiento:
    seguimientoSchema.idcontrolestablecimiento.optional(),
  titulo: seguimientoSchema.titulo,
  latitud: seguimientoSchema.latitud.optional(),
  longitud: seguimientoSchema.longitud.optional(),
  direccion: seguimientoSchema.direccion.optional(),
  comentario: seguimientoSchema.comentario.optional(),
});

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
