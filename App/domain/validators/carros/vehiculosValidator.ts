import z from "zod";
import { vehiculosSchema } from "./carros.schema.js";

const createVehiculo = z.object({
  anio: vehiculosSchema.anio,
  capacidadCarga: vehiculosSchema.capacidadCarga,
  marca: vehiculosSchema.marca,
  modelo: vehiculosSchema.modelo,
  placa: vehiculosSchema.placa,
  tipoVehiculo: vehiculosSchema.tipoVehiculo,
});

export const createVehiculoValidator = (object: unknown) =>
  createVehiculo.safeParse(object);
