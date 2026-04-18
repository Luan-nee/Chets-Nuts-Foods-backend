import z from "zod";
import { paquetesSchema } from "./paquetes.schema.js";

const createPaquetesSchema = z.object({
  clave: paquetesSchema.clave,
  destino: paquetesSchema.destino.optional(),
  observacion: paquetesSchema.observacion,
  idSalidaTransporte: paquetesSchema.idsalidatransporte,
  idUsuario: paquetesSchema.idUsuario,
  idUsuarioDestino: paquetesSchema.idUsuarioDestino,
  montoCobrado: paquetesSchema.montoCobrado,
  idDestinoEstablecimiento: paquetesSchema.idDestinoEstablecimiento.optional(),
});

const updatePaquetesSchema = z.object({
  idenvio: paquetesSchema.idEnvio,
  idUsuario: paquetesSchema.idUsuario.optional(),
  idUsuarioDestino: paquetesSchema.idUsuarioDestino.optional(),
  idsalidatransporte: paquetesSchema.idsalidatransporte.optional(),
  idDestinoEstablecimiento: paquetesSchema.idDestinoEstablecimiento.optional(),
  destino: paquetesSchema.destino.optional(),
  clave: paquetesSchema.clave.optional(),
  montocobrado: paquetesSchema.montoCobrado.optional(),
  estadopaquete: paquetesSchema.estadoPaquete.optional(),
  observacion: paquetesSchema.observacion.optional(),
});

export const createPaquetesValidator = (object: unknown) =>
  createPaquetesSchema.safeParse(object);

export const updatePaquetesValidator = (object: unknown) =>
  updatePaquetesSchema.safeParse(object);
