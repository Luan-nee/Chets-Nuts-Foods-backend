import z from "zod";
import { establecimientoSchema } from "./establecimiento.schema.js";

const createEstablecimiento = z.object({
  departamento: establecimientoSchema.departamento,
  descripcion: establecimientoSchema.descripcion,
  direccion: establecimientoSchema.direccion,
  distrito: establecimientoSchema.distrito,
  idResponsable: establecimientoSchema.idResponsable,
  latitud: establecimientoSchema.latitud,
  longitud: establecimientoSchema.longitud,
  nombreEstablecimiento: establecimientoSchema.nombreEstablecimiento,
  provincia: establecimientoSchema.provincia,
  tipoEstado: establecimientoSchema.tipoEstado.optional(),
});

export const createEstablecimientoValidatos = (object: unknown) =>
  createEstablecimiento.safeParse(object);
