import z from "zod";
import { Validator } from "../validators.js";

export const usuarioSchema = {
  iduser: z.coerce.number().int().positive(),
  nombres: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .refine((valor) => Validator.isValidFullName(valor), {
      error: "Los nombres solo pueden contener letras",
    }),
  apellidopaterno: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .refine((valor) => Validator.isValidFullName(valor), {
      error: "El apellido paterno solo puede contener letras",
    }),
  apellidomaterno: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .refine((valor) => Validator.isValidFullName(valor), {
      error: "El apellido materno solo puede contener letras",
    }),
  edad: z.string().max(120).default("18"),
  dniuser: z
    .string()
    .trim()
    .length(8)
    .refine((valor) => Validator.isOnlyNumbers(valor), {
      error: "El DNI debe contener solo números y tener 8 dígitos",
    }),
  rucuser: z
    .string()
    .trim()
    .length(11)
    .refine((valor) => Validator.isOnlyNumbers(valor), {
      error: "El RUC debe contener solo números y tener 11 dígitos",
    })
    .optional(),
  numero: z
    .string()
    .trim()
    .max(50)
    .refine((valor) => Validator.isValidPhoneNumber(valor), {
      error: "El número de teléfono no es válido",
    })
    .optional(),
  cantenvios: z.coerce.number().int().min(0).default(0),
};
