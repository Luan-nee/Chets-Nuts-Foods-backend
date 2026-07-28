import z from "zod";

export const productsDefectSchema = {
  idProductDefect: z.coerce.number().int().positive(),
  creatorAcceso: z.coerce.number().int().positive(),
  nombre: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.string().trim().max(250),
  ),
  descripcion: z.string().trim().max(300),
  calidad: z.enum(["PRIMERA", "SEGUNDA", "TERCERA"]).default("PRIMERA"),
  calibre: z.enum(["GRANDE", "MEDIANO", "ENANO", "TINY"]).default("MEDIANO"),
  fechaCreacion: z.coerce.date(),
};
