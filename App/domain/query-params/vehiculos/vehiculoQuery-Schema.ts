import z from "zod";
import { queryBaseSchema } from "../query-Schema.js";
import { Validator } from "../../validators/validators.js";

const vehiculoQuerySchema = {
  estado: z.enum(["OPERATIVO", "INACTIVO", "RESERVADO", "OCUPADO"]).optional(),
  tipo: z.enum(["PUBLICO", "PRIVADO"]).optional(),
  placa: z
    .string()
    .refine((plac) => Validator.isValidUsername(plac), {
      error: "La placa no puede contener caracteres especiales",
    })
    .optional(),
};

const vehiculoQueryValidator = z.object({
  estado: vehiculoQuerySchema.estado,
  tipo: vehiculoQuerySchema.tipo,
  page: queryBaseSchema.page,
  placa: vehiculoQuerySchema.placa,
});

export const queryValidatorVehiculo = (object: unknown) =>
  vehiculoQueryValidator.safeParse(object);
