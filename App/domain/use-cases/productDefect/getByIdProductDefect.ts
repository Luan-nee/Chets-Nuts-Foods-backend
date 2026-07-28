import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { calibreProducto, calidadProducto } from "../../../types/global.js";

interface productDefect {
  idproductdefect: number;
  nombre: string;
  descripcion: string;
  calidadproductodefect?: calidadProducto;
  calibreproductdefect?: calibreProducto;
  fechacreation: Date;
}
export async function getByIDProductDefect(id: number) {
  const { productsdefect } = generateTables();

  const [producto] = (await DB.Select([
    productsdefect.idproductdefect,
    productsdefect.nombre,
    productsdefect.descripcion,
    productsdefect.calidadproductodefect,
    productsdefect.calibreproductdefect,
    productsdefect.fechacreation,
  ])
    .from(productsdefect())
    .where(eq(productsdefect.idproductdefect, id))
    .execute()) as productDefect[];

  return producto;
}
