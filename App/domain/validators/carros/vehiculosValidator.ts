import z from "zod";
import { vehiculosSchema } from "./carros.schema.js";

const createVehiculo = z.object({
  anio: vehiculosSchema.anio,
  capacidadCarga: vehiculosSchema.capacidadCarga,
  marca: vehiculosSchema.marca,
  modelo: vehiculosSchema.modelo,
  placa: vehiculosSchema.placa,
  tipoVehiculo: vehiculosSchema.tipoVehiculo,
  vin: vehiculosSchema.vin.optional(),
  numeroHabilitacion: vehiculosSchema.numeroHabilitacion.optional(),
});

const updateVehiculo = z.object({
  idVehiculo: vehiculosSchema.idVehiculo,
  anio: vehiculosSchema.anio.optional(),
  capacidadCarga: vehiculosSchema.capacidadCarga.optional(),
  marca: vehiculosSchema.marca.optional(),
  modelo: vehiculosSchema.modelo.optional(),
  placa: vehiculosSchema.placa.optional(),
  tipoVehiculo: vehiculosSchema.tipoVehiculo.optional(),
  vin: vehiculosSchema.vin.optional(),
  numeroHabilitacion: vehiculosSchema.numeroHabilitacion.optional(),
  estadoVehiculo: vehiculosSchema.estadoVehiculo.optional(),
});

export const createVehiculoValidator = (object: unknown) =>
  createVehiculo.safeParse(object);

export const updateVehiculoValidator = (object: unknown) =>
  updateVehiculo.safeParse(object);
