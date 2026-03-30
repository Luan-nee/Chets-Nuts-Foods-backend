import z from "zod";

export const paquetesSchema = {
  idenvio: z.coerce.number().int().positive(),
  idusuario: z.coerce.number().int().positive(),
  idusuarioDestino: z.coerce.number().int().positive(),
  idsalidatransporte: z.coerce.number().int().positive(),
  idDestinoEstablecimiento: z.coerce.number().int().positive(),
  destino: z.string().max(50).optional(),
  clave: z.string().max(10),
  montocobrado: z.coerce.number().positive(),
  estadopaquete: z.enum(
    ["ENTREGADO", "CAMINO", "DETENIDO", "CANCELADO", "REVISION"],
    {
      error:
        "El estado debe ser: ENTREGADO, CAMINO, DETENIDO, CANCELADO o REVISION",
    },
  ),
  observacion: z.string().max(300).optional().nullable(),
  ultimaactualizacion: z.coerce.date().optional(),
};
