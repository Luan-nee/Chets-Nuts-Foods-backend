import z from "zod";
import { Validator } from "../validators.js";

export const seguimientoSchema = {
  idseg: z.coerce.number().int().positive().optional(),
  idpaquete: z.coerce.number().int().positive(),
  idcontrolestablecimiento: z.coerce.number().int().positive().optional(),
  latitud: z
    .string()
    .trim()
    .max(50)
    .refine((valor) => !valor || /^-?\d+\.?\d*$/.test(valor), {
      error: "La latitud debe ser un número válido",
    })
    .optional(),
  longitud: z
    .string()
    .trim()
    .max(50)
    .refine((valor) => !valor || /^-?\d+\.?\d*$/.test(valor), {
      error: "La longitud debe ser un número válido",
    })
    .optional(),
  direccion: z
    .string()
    .trim()
    .max(70)
    .refine((valor) => !valor || Validator.isValidAddress(valor), {
      error: "La dirección contiene caracteres no permitidos",
    })
    .optional(),
  comentario: z
    .string()
    .trim()
    .max(150)
    .refine((valor) => !valor || Validator.isValidDescription(valor), {
      error: "El comentario contiene caracteres no permitidos",
    })
    .optional(),
};

