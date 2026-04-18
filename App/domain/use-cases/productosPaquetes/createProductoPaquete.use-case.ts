import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateProductoPaqueteDto } from "../../dto/productosPaquete/createProducto.dto.js";
import { estadoPaquete, salidaTransType } from "../../../types/global.js";
import { CustomError } from "../../../core/res/Custom.error.js";

interface paqueteResponse {
  idenvio: number;
  estadopaquete: estadoPaquete;
  idsalidatransporte: number;
}

interface salidaTransporteResponse {
  estadotransporte: salidaTransType;
  fechacreado: Date;
}

export class CreateProductoPaqueteUseCase {
  private async validatePaquete(idpaquete: number) {
    const { paquetes, salidatransporte } = generateTables();

    const paqueteValid = (await DB.Select([
      paquetes.idenvio,
      paquetes.estadopaquete,
      paquetes.idsalidatransporte,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idpaquete))
      .execute()) as paqueteResponse[];

    if (paqueteValid.length === 0) {
      throw CustomError.badRequest("Este paquete no existe");
    }

    const [salidaTransValidate] = (await DB.Select([
      salidatransporte.estadotransporte,
      salidatransporte.fechacreado,
    ])
      .from(salidatransporte())
      .where(
        eq(
          salidatransporte.idsalidatransporte,
          paqueteValid[0].idsalidatransporte,
        ),
      )
      .execute()) as salidaTransporteResponse[];

    if (salidaTransValidate.estadotransporte !== "INICIO") {
      throw CustomError.badRequest(
        `La salida esta en estado ${salidaTransValidate.estadotransporte} no se puede agregar mas productos`,
      );
    }
  }

  async execute(productoDto: CreateProductoPaqueteDto, idpaquete: number) {
    const { productos } = generateTables();

    const query = [productos.idenvio, productos.nombreproducto, productos.peso];

    const data = [idpaquete, productoDto.nombreproducto, productoDto.peso];

    if (productoDto.observacion !== undefined) {
      query.push(productos.observacion);
      data.push(productoDto.observacion);
    }

    const idProductoNuevo = await DB.Insert(productos(), query)
      .Values(data)
      .Returning(productos.idenvio)
      .execute();

    if (idProductoNuevo === undefined || idProductoNuevo.length === 0) {
      throw CustomError.badRequest("No se pudo agregar al producto");
    }

    return idProductoNuevo[0];
  }
}
