import z from "zod";

export const guiaRemisionSchema = {
  motivoTraslado: z.enum(["01", "02", "03", "06"], {
    error: "motivoTraslado solo puede ser 01, 02, 03 o 06",
  }),
  docDestinatario: z.enum(["DNI", "RUC"], {
    error: "docDestinatario solo puede ser DNI o RUC",
  }),
  modalidadTransporte: z.enum(["01", "02"], {
    error: "modalidadTransporte solo puede ser 01 o 02",
  }),
};
