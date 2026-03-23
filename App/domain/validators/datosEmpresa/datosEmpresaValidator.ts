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

export const createDatosEmpresaValidator = (object: unknown) =>
  createDatosEmpresa.safeParse(object);
