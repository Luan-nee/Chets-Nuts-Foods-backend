import z from "zod";
import { queryBaseSchema } from "../query-Schema.js";

const vehiculoQuerySchema = {
  estado: z.enum(["OPERATIVO", "INACTIVO", "RESERVADO", "OCUPADO"]).optional(),
  tipo: z.enum(["PUBLICO", "PRIVADO"]).optional(),
};

const vehiculoQueryValidator = z.object({
  estado: vehiculoQuerySchema.estado,
  tipo: vehiculoQuerySchema.tipo,
  page: queryBaseSchema.page,
});

export const queryValidatorVehiculo = (object: unknown) =>
  vehiculoQueryValidator.safeParse(object);
