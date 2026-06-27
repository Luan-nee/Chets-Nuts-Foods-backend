import z from "zod";
import { guiaRemisionSchema } from "./guiaRemision.schema.js";

const createGuiaRemision = z.object({
  motivoTraslado: guiaRemisionSchema.motivoTraslado.optional(),
  docDestinatario: guiaRemisionSchema.docDestinatario.optional(),
  modalidadTransporte: guiaRemisionSchema.modalidadTransporte.optional(),
  idDataEmpresa: guiaRemisionSchema.idDataEmpresa,
  codigoTransporte: guiaRemisionSchema.codigoTransporte,
});

const updateGuiaRemision = z.object({
  motivoTraslado: guiaRemisionSchema.motivoTraslado.optional(),
  docDestinatario: guiaRemisionSchema.docDestinatario.optional(),
  modalidadTransporte: guiaRemisionSchema.modalidadTransporte.optional(),
});

export const createGuiaRemisionValidator = (object: unknown) =>
  createGuiaRemision.safeParse(object);

export const updateGuiaRemisionValidator = (object: unknown) =>
  updateGuiaRemision.safeParse(object);
