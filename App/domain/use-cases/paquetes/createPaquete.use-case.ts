import { AND, DB, eq, ORQ } from "zormz";
import { CreatePaqueteDto } from "../../dto/paquetes/createpaqueteDto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { salidaTransType } from "../../../types/global.js";
import { getpaqueteId } from "./getByIDPaquete.use-case.js";

interface salidaEstadoData {
  estadotransporte: salidaTransType;
}

export class CreatePaqueteUseCase {
  async validateSalidaTransporte(idsalidatransporte: number) {
    const { salidatransporte } = generateTables();

    const salida = (await DB.Select([salidatransporte.estadotransporte])
      .from(salidatransporte())
      .where(eq(salidatransporte.idsalidatransporte, idsalidatransporte))
      .execute()) as salidaEstadoData[];
    if (salida.length === 0) {
      throw CustomError.badRequest(
        `La salida de transporte con el ID ${idsalidatransporte} NO EXISTE`,
      );
    }

    if (salida[0].estadotransporte !== "INICIO") {
      throw CustomError.badRequest(
        `El transporte se encuentra ${salida[0].estadotransporte} no se puede agregar mas paquetes`,
      );
    }
  }

  async validateUsuarios(idusuario: number, idusuarioDestino: number) {
    const { usuarios } = generateTables();

    const usuariosValidate = await DB.Select([usuarios.iduser])
      .from(usuarios())
      .where(ORQ(usuarios.iduser, idusuario, idusuarioDestino))
      .execute();

    if (usuariosValidate.length !== 2) {
      throw CustomError.badRequest("El usuario Destino no existe");
    }
  }

  async execute(paqueteDto: CreatePaqueteDto) {
    this.validateSalidaTransporte(paqueteDto.idSalidaTransporte);
    this.validateUsuarios(paqueteDto.idUsuario, paqueteDto.idUsuarioDestino);
    const { paquetes } = generateTables();

    const condicional =
      paqueteDto.idDestinoEstablecimiento !== undefined
        ? eq(
            paquetes.idDestinoEstablecimiento,
            paqueteDto.idDestinoEstablecimiento,
          )
        : "";

    const paqueteID = await DB.Select([paquetes.idenvio])
      .from(paquetes())
      .where(
        AND(
          condicional,
          eq(paquetes.idusuario, paqueteDto.idUsuario),
          eq(paquetes.idsalidatransporte, paqueteDto.idSalidaTransporte),
          eq(paquetes.idusuarioDestino, paqueteDto.idUsuarioDestino),
        ),
      )
      .execute();
    if (paqueteID.length !== 0) {
      throw CustomError.badRequest(
        "Este paquete no puede ser registrado debido a que ya existe",
      );
    }

    const queryAdd = [
      paquetes.idusuario,
      paquetes.idusuarioDestino,
      paquetes.idsalidatransporte,
      paquetes.clave,
      paquetes.montocobrado,
    ];

    const queryData = [
      paqueteDto.idUsuario,
      paqueteDto.idUsuarioDestino,
      paqueteDto.idSalidaTransporte,
      paqueteDto.clave,
      paqueteDto.montoCobrado,
    ];

    if (paqueteDto.idDestinoEstablecimiento !== undefined) {
      queryAdd.push(paquetes.idDestinoEstablecimiento);
      queryData.push(paqueteDto.idDestinoEstablecimiento);
    }

    if (paqueteDto.observacion !== undefined) {
      queryAdd.push(paquetes.observacion);
      queryData.push(paqueteDto.observacion);
    }

    if (paqueteDto.destino !== undefined) {
      queryAdd.push(paquetes.destino);
      queryData.push(paqueteDto.destino);
    }

    const idPaquete = (await DB.Insert(paquetes(), queryAdd)
      .Values(queryData)
      .Returning(paquetes.idenvio)
      .execute()) as number[];

    if (idPaquete === undefined) {
      throw CustomError.badRequest("No se pudo crear el paquete");
    }

    const data = await getpaqueteId(idPaquete[0]);
    return data;
  }
}
