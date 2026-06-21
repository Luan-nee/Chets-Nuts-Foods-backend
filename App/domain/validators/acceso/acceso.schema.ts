import z from "zod";
import { Validator } from "../validators.js";

export const accesoSchema = {
  idacceso: z.coerce
    .number({ error: "El idacceso no puede ser una letra o un booleano" })
    .int({ error: "El id no puede contener decimales" })
    .positive(),
  idusuario: z.coerce
    .number({ error: "El idusuario no puede ser una letra o booleano" })
    .int({ error: "El id no puede tener decimales" })
    .positive(),
  tipos: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["ADMIN", "CHOFER", "CLIENTE", "COLABORADOR"], {
      error: "Tipos Solo esta permitido CHOFER , CLIENTE y COLABORADOR",
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
  estado: z
    .boolean({ error: "estado solo esta permitido true o false" })
    .default(true),
  numeroLicenciaConducir: z
    .string()
    .refine((valor) => Validator.isValidGeneralName(valor), {
      error: "No esta permitido caracteres especiales",
    })
    .optional(),
};
