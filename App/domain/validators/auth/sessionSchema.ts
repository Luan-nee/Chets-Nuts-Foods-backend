import z from "zod";
import { Validator } from "../validators.js";

export const sessionMainUser = {
  idUser: z.number().min(0),
  usuario: z.string().trim().max(25).min(10),
  password: z
    .string()
    .min(5)
    .refine((contra) => Validator.isValidPassword(contra), {
      error: "Contra no permitida ",
    }),
  tipos: z.enum(["ADMIN", "CHOFER", "CLIENTE", "COLABORADOR"]),
};
