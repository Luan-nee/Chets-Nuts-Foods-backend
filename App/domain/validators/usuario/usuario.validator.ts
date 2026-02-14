import z, { object } from "zod";
import { usuarioSchema } from "./usuario.schema.js";

const createUsuarioSchema = z.object({
  nombre: usuarioSchema.nombres,
  apellidopaterno: usuarioSchema.apellidopaterno,
  apellidomaterno: usuarioSchema.apellidomaterno,
  edad: usuarioSchema.edad,
  dni: usuarioSchema.dniuser.optional(),
  ruc: usuarioSchema.rucuser.optional(),
  numero: usuarioSchema.numero.optional(),
  tipo: usuarioSchema.tipo.optional(),
});

const updateUsuarioSchema = z.object({
  iduser: usuarioSchema.iduser,
  nombre: usuarioSchema.nombres.optional(),
  apellidopaterno: usuarioSchema.apellidopaterno.optional(),
  apellidomaterno: usuarioSchema.apellidomaterno.optional(),
  edad: usuarioSchema.edad.optional(),
  rucuser: usuarioSchema.rucuser.optional(),
  numero: usuarioSchema.numero.optional(),
  dni: usuarioSchema.dniuser.optional(),
  tipo: usuarioSchema.tipo.optional(),
});

const dniValidSchema = z.object({
  dni: usuarioSchema.dniuser,
});

const rucValidSchema = z.object({
  ruc: usuarioSchema.rucuser,
});

export const createUsuarioValidator = (object: unknown) =>
  createUsuarioSchema.safeParse(object);

export const updateUsuarioValidator = (object: unknown) =>
  updateUsuarioSchema.safeParse(object);

export const dniUsuarioValidator = (object: unknown) =>
  dniValidSchema.safeParse(object);

export const rucUsuarioValidator = (object: unknown) =>
  rucValidSchema.safeParse(object);
