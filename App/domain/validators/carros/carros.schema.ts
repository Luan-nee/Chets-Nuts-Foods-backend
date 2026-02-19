import z from "zod";
import { Validator } from "../validators.js";

export const vehiculosSchema = {
  idvehempresa: z.number().min(0),
  anio: z
    .string()
    .trim()
    .refine((valor) => Validator.isOnlyNumbers(valor), {
      error: "Solo esta permitido numeros en el año",
    }),
  capacidadCarga: z.number().min(0),
  marca: z.string().trim(),
  modelo: z.string().trim(),
  placa: z.string().trim(),
  tipoVehiculo: z.string().trim(),
};
