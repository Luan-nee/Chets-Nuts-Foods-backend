import z from "zod";
import { Validator } from "../validators.js";

export const datosEmpresaSchema = {
  idDatosEmpresa: z.number().min(0),
  ruc: z
    .string()
    .trim()
    .refine((valor) => Validator.isOnlyNumbers(valor), {
      error: "El ruc solo puede contener numeros",
    }),
  denominacion: z
    .string()
    .trim()
    .refine((valor) => Validator.isValidAddress(valor), {
      error:
        "La denominacion es el nombre de la Empressa que la sunat le otorgo",
    }),
  numeroRegistroMtc: z
    .string()
    .trim()
    .refine((valor) => Validator.isOnlyNumbers(valor), {
      error:
        "El numero de registro que le entrego la Sunat al momento de registrarse al MTC",
    }),
  codigoMtc: z.string().trim(),
  urlApi: z.string().trim(),
  claveAcceso: z.string().trim(),
};
