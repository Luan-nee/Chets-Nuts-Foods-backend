import z from "zod";

export const idTypeBaseSchema = {
  numericId: z.coerce
    .number({
      error: "ID invalido",
    })
    .positive(),
  uuid: z.uuid(),
};
