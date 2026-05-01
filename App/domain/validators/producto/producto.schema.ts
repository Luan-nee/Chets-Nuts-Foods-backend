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
    })
    .transform((val) => val.toLocaleLowerCase()),
  observacion: z
    .string()
    .trim()
    .max(150)
    .refine((valor) => !valor || Validator.isValidDescription(valor), {
      error: "La observación contiene caracteres no permitidos",
    })
    .optional(),
  pesounitario: z.coerce.number().min(0),
  cantidad: z.coerce.number().int().min(1).default(1),
  fechacreacion: z.coerce.date().optional(),
  fechaactualizado: z.coerce.date().optional(),
};
