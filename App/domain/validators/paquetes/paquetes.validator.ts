import z from "zod";
import { paquetesSchema } from "./paquetes.schema.js";

const createPaquetesSchema = z.object({
  idusuario: paquetesSchema.idusuario,
  idusuarioDestino: paquetesSchema.idusuarioDestino,
  idsalidatransporte: paquetesSchema.idsalidatransporte,
  idDestinoEstablecimiento: paquetesSchema.idDestinoEstablecimiento,
  destino: paquetesSchema.destino,
  clave: paquetesSchema.clave,
  montocobrado: paquetesSchema.montocobrado,
  estadopaquete: paquetesSchema.estadopaquete.default("CAMINO"),
  observacion: paquetesSchema.observacion,
});

const updatePaquetesSchema = z.object({
  idenvio: paquetesSchema.idenvio,
  idusuario: paquetesSchema.idusuario.optional(),
  idusuarioDestino: paquetesSchema.idusuarioDestino.optional(),
  idsalidatransporte: paquetesSchema.idsalidatransporte.optional(),
  idDestinoEstablecimiento: paquetesSchema.idDestinoEstablecimiento.optional(),
  destino: paquetesSchema.destino.optional(),
  clave: paquetesSchema.clave.optional(),
  montocobrado: paquetesSchema.montocobrado.optional(),
  estadopaquete: paquetesSchema.estadopaquete.optional(),
  observacion: paquetesSchema.observacion.optional(),
});

export const createPaquetesValidator = (object: unknown) =>
  createPaquetesSchema.safeParse(object);

export const updatePaquetesValidator = (object: unknown) =>
  updatePaquetesSchema.safeParse(object);
