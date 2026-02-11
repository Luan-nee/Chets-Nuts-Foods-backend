import z from "zod";
import { Validator } from "../validators.js";

export const accesoSchema = {
  idacceso: z.coerce.number().int().positive().optional(),
  idusuario: z.coerce.number().int().positive(),
  tipos: z.enum(["ADMIN", "CHOFER", "CLIENTE", "COLABORADOR"], {
    errorMap: () => ({ message: "El tipo de acceso debe ser ADMIN, CHOFER, CLIENTE o COLABORADOR" }),
  }),
  correo: z
    .string()
    .trim()
    .email("El correo electrónico no es válido")
    .max(200)
    .toLowerCase(),
  contra: z
    .string()
    .min(5)
    .max(50)
    .refine((valor) => Validator.isValidPassword(valor), {
      error: "La contraseña contiene caracteres no permitidos",
    }),
  estado: z.boolean().default(true),
};

