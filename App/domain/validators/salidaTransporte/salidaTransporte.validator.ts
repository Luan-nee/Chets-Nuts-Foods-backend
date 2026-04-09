import z from "zod";
import { salidaTransporteSchema } from "./salidaTransporte.schema.js";

const createSalidaTransporteSchema = z.object({
  idVehiculo: salidaTransporteSchema.idVehiculo,
  idChoferAcceso: salidaTransporteSchema.idChoferAcceso,
  idOrigenEstablecimiento: salidaTransporteSchema.idOrigenEstablecimiento,
  idDestinoEstablecimiento: salidaTransporteSchema.idDestinoEstablecimiento,
  fechaSalida: salidaTransporteSchema.fechaSalida,
});

const updateSalidaTransporteSchema = z.object({
  idsalidatransporte: salidaTransporteSchema.idsalidatransporte,
  idChoferAcceso: salidaTransporteSchema.idChoferAcceso.optional(),
  idVehiculo: salidaTransporteSchema.idVehiculo.optional(),
  estadoTransporte: salidaTransporteSchema.estadoTransporte.optional(),
  fechaSalida: salidaTransporteSchema.fechaSalida.optional(),
  idOrigenEstablecimiento:
    salidaTransporteSchema.idOrigenEstablecimiento.optional(),
});

export const createSalidaTransporteValidator = (object: unknown) =>
  createSalidaTransporteSchema.safeParse(object);

export const updateSalidaTransporteValidator = (object: unknown) =>
  updateSalidaTransporteSchema.safeParse(object);
