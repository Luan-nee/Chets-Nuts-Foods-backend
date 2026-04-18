import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";

export class GetAllPaqueteUseCase {
  async execute(idsalida: number) {
    const { paquetes } = generateTables();

    const paquetesData = await DB.Select([
      `${paquetes.idenvio} AS idpaquete`,
      paquetes.destino,
      paquetes.montocobrado,
      paquetes.estadopaquete,
      paquetes.fechacreado,
      `${paquetes.cantidadproduct} AS cantidadProductos`,
    ])
      .from(paquetes())
      .where(eq(paquetes.idsalidatransporte, idsalida))
      .execute();

    return paquetesData;
  }
}
