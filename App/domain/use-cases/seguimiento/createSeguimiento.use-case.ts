import { DB, eq, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateSeguimientoDto } from "../../dto/seguimiento/createSeguimiento.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { estadoPaquete } from "../../../types/global.js";
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
    return idRetorno[0];
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
