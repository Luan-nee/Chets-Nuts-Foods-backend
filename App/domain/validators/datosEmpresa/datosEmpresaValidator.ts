import z from "zod";
import { datosEmpresaSchema } from "./datosEmpresaSchema.js";

const createDatosEmpresa = z.object({
  ruc: datosEmpresaSchema.ruc,
  denominacion: datosEmpresaSchema.denominacion,
  numeroRegistroMtc: datosEmpresaSchema.numeroRegistroMtc,
  codigoMtc: datosEmpresaSchema.codigoMtc,
  urlApi: datosEmpresaSchema.urlApi.optional(),
  claveAcceso: datosEmpresaSchema.claveAcceso.optional(),
  correo: datosEmpresaSchema.correo,
  fechaVigenciaRegistroMtc: datosEmpresaSchema.fechavigenciaregistro,
});

const updateDatosEmpresa = z.object({
  ruc: datosEmpresaSchema.ruc.optional(),
  denominacion: datosEmpresaSchema.denominacion.optional(),
  numeroRegistroMtc: datosEmpresaSchema.numeroRegistroMtc.optional(),
  codigoMtc: datosEmpresaSchema.codigoMtc.optional(),
  urlApi: datosEmpresaSchema.urlApi.optional(),
  claveAcceso: datosEmpresaSchema.claveAcceso.optional(),
  correo: datosEmpresaSchema.correo.optional(),
  fechaVigenciaRegistroMtc: datosEmpresaSchema.fechavigenciaregistro.optional(),
});

export const createDatosEmpresaValidator = (object: unknown) =>
  createDatosEmpresa.safeParse(object);

export const updateDatosEmpresaValidator = (object: unknown) =>
  updateDatosEmpresa.safeParse(object);
