import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { estadoPaquete } from "../../../types/global.js";
import { ConvertLetras } from "../../../services/convertLetras.js";

interface ResponseGetAll {
  idpaquete: number;
  destino: string;
  montocobrado: number;
  estadopaquete: estadoPaquete;
  fechacreado: Date;
  cantidadProductos: number;
  sala?: string;
}
export class GetAllPaqueteUseCase {
  async execute(idsalida: number) {
    const { paquetes } = generateTables();

    const paquetesData = (await DB.Select([
      `${paquetes.idenvio} AS idpaquete`,
      paquetes.destino,
      paquetes.montocobrado,
      paquetes.estadopaquete,
      paquetes.fechacreado,
      `${paquetes.cantidadproduct} AS cantidadProductos`,
    ])
      .from(paquetes())
      .where(eq(paquetes.idsalidatransporte, idsalida))
      .execute()) as ResponseGetAll[];
    paquetesData.forEach((data) => {
      data.sala = ConvertLetras(data.idpaquete);
    });
    return paquetesData;
  }
}
