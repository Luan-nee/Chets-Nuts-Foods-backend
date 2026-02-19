import z from "zod";
import { Validator } from "../validators.js";

export const envioSchema = {
  idenvio: z.coerce.number().int().positive().optional(),
  idusuario: z.coerce.number().int().positive(),
  idchofer: z.coerce.number().int().positive(),
  idvehiculo: z.coerce.number().int().positive(),
  idusuarioDestino: z.coerce.number().int().positive(),
  idorigenestablecimiento: z.coerce.number().int().positive(),
  idDestinoEstablecimiento: z.coerce.number().int().positive(),
  clave: z
    .string()
    .trim()
    .length(10)
    .refine((valor) => /^[A-Z0-9]+$/.test(valor), {
      error: "La clave debe contener solo letras mayúsculas y números",
    }),
  montocobrado: z.coerce.number().positive(),
  destino: z
    .string()
    .trim()
    .max(50)
    .refine((valor) => !valor || Validator.isValidAddress(valor), {
      error: "El destino contiene caracteres no permitidos",
    })
    .optional(),
  tiempoestimado: z.string().trim().max(50).optional(),
  estado: z.enum(["ENTREGADO", "CAMINO", "DETENIDO", "CANCELADO", "REVISION"], {
    error: () => ({
      message:
        "El estado debe ser ENTREGADO, CAMINO, DETENIDO, CANCELADO o REVISION",
    }),
  }),
  observacion: z
    .string()
    .trim()
    .max(300)
    .refine((valor) => !valor || Validator.isValidDescription(valor), {
      error: "La observación contiene caracteres no permitidos",
    })
    .optional(),
};
