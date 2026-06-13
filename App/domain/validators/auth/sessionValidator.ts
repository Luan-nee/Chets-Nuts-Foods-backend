import z, { object } from "zod";
import { sessionMainUser } from "./sessionSchema.js";

const createSessionUser = z.object({
  usuario: sessionMainUser.usuario,
  password: sessionMainUser.password,
});

const createSessionClient = z.object({
  sala: sessionMainUser.sala,
  dni: sessionMainUser.dni,
  clave: sessionMainUser.clave,
});

export const createSessionValidator = (object: unknown) =>
  createSessionUser.safeParse(object);

export const createSessionClientValidator = (Object: unknown) =>
  createSessionClient.safeParse(Object);
