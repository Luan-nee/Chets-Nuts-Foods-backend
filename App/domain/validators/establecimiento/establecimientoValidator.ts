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
  codigoSunat: establecimientoSchema.codigoSunat,
  ubigeo: establecimientoSchema.ubigeo,
});

const updateEstablecimiento = z.object({
  idEstablecimiento: establecimientoSchema.idEstablecimiento,
  departamento: establecimientoSchema.departamento.optional(),
  descripcion: establecimientoSchema.descripcion.optional(),
  direccion: establecimientoSchema.direccion.optional(),
  distrito: establecimientoSchema.distrito.optional(),
  idResponsable: establecimientoSchema.idResponsable.optional(),
  latitud: establecimientoSchema.latitud.optional(),
  longitud: establecimientoSchema.longitud.optional(),
  nombreEstablecimiento: establecimientoSchema.nombreEstablecimiento.optional(),
  provincia: establecimientoSchema.provincia.optional(),
  tipoEstado: establecimientoSchema.tipoEstado.optional(),
  codigoSunat: establecimientoSchema.codigoSunat.optional(),
  ubigeo: establecimientoSchema.ubigeo.optional(),
  activo: establecimientoSchema.activo.optional(),
});

export const createEstablecimientoValidatos = (object: unknown) =>
  createEstablecimiento.safeParse(object);

export const updateEstablecimientoValidator = (object: unknown) =>
  updateEstablecimiento.safeParse(object);
