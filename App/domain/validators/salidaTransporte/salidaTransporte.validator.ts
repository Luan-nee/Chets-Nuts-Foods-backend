import z from "zod";
import { salidaTransporteSchema } from "./salidaTransporte.schema.js";

const createSalidaTransporteSchema = z.object({
  idVehiculo: salidaTransporteSchema.idVehiculo,
  idChoferAcceso: salidaTransporteSchema.idChoferAcceso,
  idOrigenEstablecimiento: salidaTransporteSchema.idOrigenEstablecimiento,
  fechaSalida: salidaTransporteSchema.fechaSalida,
  estadoTransporte: salidaTransporteSchema.estadoTransporte,
});

const updateSalidaTransporteSchema = z.object({
  idsalidatransporte: salidaTransporteSchema.idsalidatransporte,
  idvehiculo: salidaTransporteSchema.idVehiculo.optional(),
  idchoferusuario: salidaTransporteSchema.idChoferAcceso.optional(),
  idorigenestablecimiento:
    salidaTransporteSchema.idOrigenEstablecimiento.optional(),
  fechasalida: salidaTransporteSchema.fechaSalida.optional(),
  estadotransporte: salidaTransporteSchema.estadoTransporte.optional(),
  fechafinalizado: salidaTransporteSchema.fechafinalizado.optional(),
});

export const createSalidaTransporteValidator = (object: unknown) =>
  createSalidaTransporteSchema.safeParse(object);

export const updateSalidaTransporteValidator = (object: unknown) =>
  updateSalidaTransporteSchema.safeParse(object);
