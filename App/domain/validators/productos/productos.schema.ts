import z from "zod";
import { Validator } from "../validators.js";

export const productosSchema = {
  sku: z.coerce.string().min(2).max(7),
  nombre: z
    .string()
    .min(5)
    .max(75)
    .refine((valor) => Validator.isValidFullName(valor), {
      error: "el Nombre solo puede contener caracteres",
    }),
  descripcion: z
    .string()
    .min(0)
    .max(150)
    .refine((descrip) => Validator.isValidDescription(descrip), {
      error: "La descripcion solo puede contener ciertos caracteres",
    }),
  stockActual: z.coerce.number().positive().default(0),
  stockMinimo: z.coerce.number().positive().default(0),
  precioCompraProveedor: z.coerce.number().positive().default(0),
  porcentajeGananacia: z.string().max(5).default("0"),
  idUserAdmin: z.number().optional(),
};
