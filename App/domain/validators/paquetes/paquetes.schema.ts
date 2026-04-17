import z from "zod";

export const paquetesSchema = {
  idEnvio: z.coerce.number().int().positive(),
  idUsuario: z.coerce.number().int().positive(),
  idUsuarioDestino: z.coerce.number().int().positive(),
  idsalidatransporte: z.coerce.number().int().positive(),
  idDestinoEstablecimiento: z.coerce.number().int().positive(),
  destino: z.string().max(50).optional(),
  clave: z.string().max(10),
  montoCobrado: z.coerce.number().positive(),
  estadoPaquete: z.enum(
    ["ENTREGADO", "CAMINO", "DETENIDO", "CANCELADO", "REVISION"],
    {
      error:
        "El estado debe ser: ENTREGADO, CAMINO, DETENIDO, CANCELADO o REVISION",
    },
  ),
  observacion: z.string().max(300).optional(),
  ultimaActualizacion: z.coerce.date().optional(),
};
