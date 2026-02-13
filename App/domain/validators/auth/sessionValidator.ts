import z from "zod";
import { sessionMainUser } from "./sessionSchema.js";

const createSessionUser = z.object({
  usuario: sessionMainUser.usuario,
  password: sessionMainUser.password,
  tipos: sessionMainUser.tipos,
  idUser: sessionMainUser.idUser,
});

export const createSessionValidator = (object: unknown) =>
  createSessionUser.safeParse(object);
