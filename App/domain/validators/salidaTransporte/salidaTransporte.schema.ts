import z from "zod";

export const salidaTransporteSchema = {
  idsalidatransporte: z.coerce.number().int().positive(),
  idVehiculo: z.coerce.number().int().positive(),
  idChoferAcceso: z.coerce.number().int().positive(),
  idOrigenEstablecimiento: z.coerce.number().int().positive(),
  idDestinoEstablecimiento: z.coerce.number().int().positive(),
  fechaSalida: z.coerce.date({
    error: "Error al ingresar la fecha, recomedable enviar YY-MM-DD",
  }),
  estadoTransporte: z.enum(["INICIO", "EN CAMINO", "FINALIZADO", "CANCELADO"], {
    error: "El estado debe ser: INICIO, EN CAMINO o FINALIZADO",
  }),
  fechafinalizado: z.coerce.date().optional().nullable(),
  fechacreado: z.coerce.date().optional(),
  horasalida: z.string({
    error: "hora de salida es importante, recomendable H:M ",
  }),
};
