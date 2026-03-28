import z from "zod";
import { Validator } from "../validators.js";
import { departamentosPeru } from "../../../consts.js";

export const establecimientoSchema = {
  idEstablecimiento: z.number().min(0),
  departamento: z.enum(departamentosPeru),
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
    .refine((nombre) => Validator.isValidAddress(nombre), {
      error: "el nombre no puede contener caracteres especiales",
    }),
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
  codigoSunat: z
    .string()
    .max(5, {
      error: "El codigo de la sunat no puede contener mas de 4 caracteres",
    })
    .optional(),
  ubigeo: z.string().trim().max(15),
  activo: z.boolean(),
};
