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
  sala: z
    .string()
    .refine((caracter) => Validator.isValidLetrasMayusculas(caracter), {
      error:
        "La sala no puede contener numero ni caracteres especiales todo mayuscula",
    }),
  dni: z.string().refine((caracter) => Validator.isVlaisNumeros(caracter), {
    error: "El campo de DNI solo puede contener numero",
  }),
  clave: z.string(),
};
