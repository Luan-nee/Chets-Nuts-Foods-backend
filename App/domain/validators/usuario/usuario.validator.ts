import z from "zod";
import { usuarioSchema } from "./usuario.schema.js";

const createUsuarioSchema = z.object({
  nombre: usuarioSchema.nombres,
  apellidopaterno: usuarioSchema.apellidopaterno,
  apellidomaterno: usuarioSchema.apellidomaterno,
  edad: usuarioSchema.edad,
  dni: usuarioSchema.dniuser,
  ruc: usuarioSchema.rucuser,
  numero: usuarioSchema.numero,
});

const updateUsuarioSchema = z.object({
  nombres: usuarioSchema.nombres.optional(),
  apellidopaterno: usuarioSchema.apellidopaterno.optional(),
  apellidomaterno: usuarioSchema.apellidomaterno.optional(),
  edad: usuarioSchema.edad.optional(),
  dniuser: usuarioSchema.dniuser.optional(),
  rucuser: usuarioSchema.rucuser.optional(),
  numero: usuarioSchema.numero.optional(),
  cantenvios: usuarioSchema.cantenvios.optional(),
});

export const createUsuarioValidator = (object: unknown) =>
  createUsuarioSchema.safeParse(object);

export const updateUsuarioValidator = (object: unknown) =>
  updateUsuarioSchema.safeParse(object);
