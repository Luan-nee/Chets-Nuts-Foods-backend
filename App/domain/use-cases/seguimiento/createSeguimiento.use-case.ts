import { AND, DB, eq, neq, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateSeguimientoDto } from "../../dto/seguimiento/createSeguimiento.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { estadoPaquete, ResponseSeguimiento } from "../../../types/global.js";
import { UpdateParam } from "../../../consts.js";
import { getpaqueteId } from "../paquetes/getByIDPaquete.use-case.js";

interface paqueteResponse {
  idsalidatransporte: number;
  estadopaquete: estadoPaquete;
  fechacreado: Date;
}

export class CreateSeguimientoUseCase {
  async validateSalidatransporte(id: number) {
    const { salidatransporte } = generateTables();

    const dataresponse = (await DB.Select([salidatransporte.idsalidatransporte])
      .from(salidatransporte())
      .where(eq(salidatransporte.idsalidatransporte, id))
      .execute()) as { idsalidatransporte: number }[];

    if (dataresponse.length === 0) {
      throw CustomError.badRequest(
        `La salida de transporte con el ID: ${id} no existe`,
      );
    }
  }

  async validateEstablecimiento(id: number) {
    const { establecimientos } = generateTables();

    const datos = (await DB.Select([
      establecimientos.idEst,
      establecimientos.activo,
    ])
      .from(establecimientos())
      .where(eq(establecimientos.idEst, id))
      .execute()) as { idEst: number; activo: boolean }[];

    if (datos.length === 0 || !datos[0].activo) {
      throw CustomError.badRequest(
        "No existe este Establecimiento o esta INABILITADO",
      );
    }
  }

  private async getpaquetesIdSeg(idsalidatransporte: number) {
    const { salidatransporte, paquetes } = generateTables();

    const ids = (await DB.Select([paquetes.idenvio])
      .from(paquetes())
      .innerJOIN(
        salidatransporte(),
        eq(
          salidatransporte.idsalidatransporte,
          paquetes.idsalidatransporte,
          false,
        ),
      )
      .where(
        AND(
          neq(paquetes.estadopaquete, "CANCELADO"),
          neq(paquetes.estadopaquete, "ENTREGADO"),
          eq(paquetes.idsalidatransporte, idsalidatransporte),
        ),
      )
      .execute(true)) as { idenvio: number }[];
    if (ids === undefined) {
      return [];
    }
    console.log(ids);
    return ids;
  }

  async create(id: number, seguimiento: CreateSeguimientoDto) {
    const { seguimientopaquetes } = generateTables();

    const query = [
      seguimientopaquetes.titulo,
      seguimientopaquetes.idsalidatransporte,
    ];
    const data: any[] = [seguimiento.titulo, id];

    await this.validateSalidatransporte(id);

    if (seguimiento.idcontrolestablecimiento !== undefined) {
      await this.validateEstablecimiento(seguimiento.idcontrolestablecimiento);
      query.push(seguimientopaquetes.idcontrolestablecimiento);
      data.push(seguimiento.idcontrolestablecimiento);
    }

    if (seguimiento.comentario !== undefined) {
      query.push(seguimientopaquetes.comentario);
      data.push(seguimiento.comentario);
    }

    if (seguimiento.direccion !== undefined) {
      query.push(seguimientopaquetes.direccion);
      data.push(seguimiento.direccion);
    }

    if (seguimiento.latitud !== undefined) {
      query.push(seguimientopaquetes.latitud);
      data.push(seguimiento.latitud);
    }

    if (seguimiento.longitud !== undefined) {
      query.push(seguimientopaquetes.longitud);
      data.push(seguimiento.longitud);
    }
    const idRetorno = await DB.Insert(seguimientopaquetes(), query)
      .Values(data)
      .Returning(seguimientopaquetes.idseg)
      .execute();

    if (idRetorno === undefined || idRetorno.length === 0) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de agregar el producto",
      );
    }

    const seguimientoResponse = await this.getpaquetesIdSeg(id);

    const [dataResponse] = (await DB.Select([
      seguimientopaquetes.idseg,
      seguimientopaquetes.idcontrolestablecimiento,
      seguimientopaquetes.titulo,
      seguimientopaquetes.direccion,
      seguimientopaquetes.latitud,
      seguimientopaquetes.longitud,
      seguimientopaquetes.comentario,
      seguimientopaquetes.fecharegistro,
    ])
      .from(seguimientopaquetes())
      .where(eq(seguimientopaquetes.idseg, idRetorno[0]))
      .execute()) as ResponseSeguimiento[];

    return { data: dataResponse, ids: seguimientoResponse };
  }

  async entregaPaquete(idpaquete: number, seguimiento: CreateSeguimientoDto) {
    const { paquetes } = generateTables();

    const paquete = (await DB.Select([
      paquetes.idsalidatransporte,
      paquetes.estadopaquete,
      paquetes.fechacreado,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idpaquete))
      .execute()) as paqueteResponse[];

    if (paquete.length === 0 || paquete[0].estadopaquete === "ENTREGADO") {
      throw CustomError.badRequest("Este paquete no existe o ya fue entregado");
    }

    seguimiento.comentario += `Entrega del paquete ID:${idpaquete}`;

    await this.create(paquete[0].idsalidatransporte, seguimiento);

    const campoUpdate: UpdateParam[] = [];

    campoUpdate.push(
      UP(
        paquetes.observacion,
        `El paquete fue entregado en: %direccion:${seguimiento.direccion}% - %${seguimiento.latitud}% - %longitud:${seguimiento.longitud}% `,
      ),
    );

    campoUpdate.push(UP(paquetes.estadopaquete, "ENTREGADO"));

    await DB.Update(paquetes())
      .set(campoUpdate)
      .where(eq(paquetes.idenvio, idpaquete))
      .execute();

    const paqueteResponse = await getpaqueteId(idpaquete);
    return paqueteResponse;
  }
}
