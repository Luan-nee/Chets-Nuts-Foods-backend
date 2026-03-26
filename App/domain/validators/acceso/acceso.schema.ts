import z from "zod";
import { Validator } from "../validators.js";

export const accesoSchema = {
  idacceso: z.coerce.number().int().positive(),
  idusuario: z.coerce.number().int().positive(),
  tipos: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["ADMIN", "CHOFER", "CLIENTE", "COLABORADOR"], {
      error: "Solo esta permitido CHOFER , CLIENTE y COLABORADOR",
    }),
  ),
  correo: z.string().trim().max(200).toLowerCase(),
  contra: z
    .string()
    .min(5)
    .max(50)
    .refine((valor) => Validator.isValidPassword(valor), {
      error: "La contraseña contiene caracteres no permitidos",
    }),
  estado: z.boolean().default(true),
};
