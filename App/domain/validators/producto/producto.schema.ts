import z from "zod";
import { Validator } from "../validators.js";

export const productoEnvioSchema = {
  id: z.coerce.number().int().positive().optional(),
  idenvio: z.coerce.number().int().positive(),
  nombreproducto: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .refine((valor) => Validator.isValidGeneralName(valor), {
      error: "El nombre del producto contiene caracteres no permitidos",
    }),
  observacion: z
    .string()
    .trim()
    .max(150)
    .refine((valor) => !valor || Validator.isValidDescription(valor), {
      error: "La observación contiene caracteres no permitidos",
    })
    .optional(),
  peso: z
    .string()
    .trim()
    .max(50)
    .refine((valor) => /^\d+(\.\d+)?\s*(kg|KG|Kg|kilogramo|kilogramos)?$/.test(valor), {
      error: "El peso debe estar en formato numérico con unidad (ej: 10 kg)",
    }),
};

