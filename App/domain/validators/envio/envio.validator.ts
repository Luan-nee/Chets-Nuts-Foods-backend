import z from "zod";
import { envioSchema } from "./envio.schema.js";

// Schema para crear un nuevo envío
const createEnvioSchema = z.object({
  idusuario: envioSchema.idusuario,
  idchofer: envioSchema.idchofer,
  idvehiculo: envioSchema.idvehiculo,
  idusuarioDestino: envioSchema.idusuarioDestino,
  idorigenestablecimiento: envioSchema.idorigenestablecimiento,
  idDestinoEstablecimiento: envioSchema.idDestinoEstablecimiento,
  clave: envioSchema.clave,
  montocobrado: envioSchema.montocobrado,
  destino: envioSchema.destino,
  tiempoestimado: envioSchema.tiempoestimado,
  estado: envioSchema.estado,
  observacion: envioSchema.observacion,
});

// Schema para actualizar un envío
const updateEnvioSchema = z.object({
  idusuario: envioSchema.idusuario.optional(),
  idchofer: envioSchema.idchofer.optional(),
  idvehiculo: envioSchema.idvehiculo.optional(),
  idusuarioDestino: envioSchema.idusuarioDestino.optional(),
  idorigenestablecimiento: envioSchema.idorigenestablecimiento.optional(),
  idDestinoEstablecimiento: envioSchema.idDestinoEstablecimiento.optional(),
  clave: envioSchema.clave.optional(),
  montocobrado: envioSchema.montocobrado.optional(),
  destino: envioSchema.destino,
  tiempoestimado: envioSchema.tiempoestimado,
  estado: envioSchema.estado.optional(),
  observacion: envioSchema.observacion,
});

export const createEnvioValidator = (object: unknown) =>
  createEnvioSchema.safeParse(object);

export const updateEnvioValidator = (object: unknown) =>
  updateEnvioSchema.safeParse(object);

