import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";

export class GetSeguimientoUseCase {
  async getAllSeguimiento(id: number) {
    const { seguimientopaquetes } = generateTables();

    const seguimiento = await DB.Select([
      seguimientopaquetes.idseg,
      seguimientopaquetes.idcontrolestablecimiento,
      seguimientopaquetes.titulo,
      seguimientopaquetes.latitud,
      seguimientopaquetes.longitud,
      seguimientopaquetes.direccion,
      seguimientopaquetes.comentario,
    ])
      .from(seguimientopaquetes())
      .where(eq(seguimientopaquetes.idpaquete, id))
      .OrderBy({ idseg: "DESC" })
      .execute();

    return seguimiento;
  }
}
