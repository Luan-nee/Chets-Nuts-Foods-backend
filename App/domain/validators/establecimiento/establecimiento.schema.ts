import z from "zod";
import { Validator } from "../validators.js";

export const establecimientoSchema = {
  departamento: z
    .string()
    .min(0)
    .refine((valor) => Validator.isValidFullName(valor), {
      error: "Los Departamentos del pais no contienen numeros",
    }),
  descripcion: z
    .string()
    .refine((valor) => Validator.isValidDescription(valor), {
      error: "La descripcion no puede contener caracteres muy especiales",
    }),
  direccion: z
    .string()
    .min(0)
    .refine((dir) => Validator.isValidAddress(dir), {
      error:
        "La direccion no puede contener caracteres especiales a parte de los numeros",
    }),
  distrito: z.string().refine((valor) => Validator.isValidFullName(valor)),
  idResponsable: z.number().min(0),
  latitud: z.string(),
  longitud: z.string(),
  nombreEstablecimiento: z
    .string()
    .refine((nombre) => Validator.isValidFullName(nombre)),
  provincia: z
    .string()
    .trim()
    .refine((prov) => Validator.isValidFullName(prov), {
      error: "La provincia no puede contener caracteres especiales",
    }),
  tipoEstado: z.enum(
    ["fiscal", "anexo", "almacen", "oficina", "no_registrado"],
    {
      error:
        " Estado de establecimiento solo puede contener fiscal | anexo | almacen | oficina | no_registrado",
    },
  ),
};
