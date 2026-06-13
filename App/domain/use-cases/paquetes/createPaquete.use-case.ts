import { AND, DB, eq, ORQ, UP } from "zormz";
import { CreatePaqueteDto } from "../../dto/paquetes/createpaqueteDto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { estadoPaquete, salidaTransType } from "../../../types/global.js";
import { getpaqueteId } from "./getByIDPaquete.use-case.js";
import { UpdatePaqueteDto } from "../../dto/paquetes/updatePaquetesDto.js";
import { UpdateParam } from "../../../consts.js";
import { ConvertLetras } from "../../../services/convertLetras.js";

interface salidaEstadoData {
  estadotransporte: salidaTransType;
}

interface paquetesType {
  estadopaquete: estadoPaquete;
  clave: string;
  idusuario: number;
  idusuarioDestino: number;
  idsalidatransporte: number;
  idDestinoEstablecimiento: number;
  destino: string;
  montocobrado: number;
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

  async validateEstablecimiento(idEstablecimiento: number) {
    const { establecimientos } = generateTables();

    const estableResponse = await DB.Select([establecimientos.idEst])
      .from(establecimientos())
      .where(eq(establecimientos.idEst, idEstablecimiento))
      .execute();

    if (estableResponse.length === 0) {
      throw CustomError.badRequest(
        `El establecimiento de destino no existe, por favor ingrese uno valido`,
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
      await this.validateEstablecimiento(paqueteDto.idDestinoEstablecimiento);
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

    const sala = ConvertLetras(idPaquete[0]);

    return { data, sala };
  }

  async update(newPaquete: UpdatePaqueteDto, idpaquete: number) {
    const { paquetes } = generateTables();

    const [oldPaquete] = (await DB.Select([
      paquetes.estadopaquete,
      paquetes.clave,
      paquetes.idusuario,
      paquetes.idusuarioDestino,
      paquetes.idsalidatransporte,
      paquetes.idDestinoEstablecimiento,
      paquetes.destino,
      paquetes.montocobrado,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idpaquete))
      .execute()) as paquetesType[];

    if (oldPaquete.estadopaquete !== "HOME") {
      throw CustomError.badRequest(
        `Este paquete ya no se puede actualizar debido a que se encuentra en estado ${oldPaquete.estadopaquete}`,
      );
    }

    const paqueteUpdate: UpdateParam[] = [];

    if (newPaquete.idUsuarioDestino !== undefined) {
      const idUser =
        newPaquete.idUsuario !== undefined
          ? newPaquete.idUsuario
          : Number(oldPaquete.idusuario);

      await this.validateUsuarios(idUser, newPaquete.idUsuarioDestino);

      paqueteUpdate.push(UP(paquetes.idusuario, `${idUser}`));
      paqueteUpdate.push(
        UP(paquetes.idusuarioDestino, `${newPaquete.idUsuarioDestino}`),
      );
    }

    if (newPaquete.idSalidaTransporte !== undefined) {
      await this.validateSalidaTransporte(newPaquete.idSalidaTransporte);

      paqueteUpdate.push(
        UP(paquetes.idsalidatransporte, `${newPaquete.idSalidaTransporte}`),
      );
    }

    if (newPaquete.idDestinoEstablecimiento !== undefined) {
      await this.validateEstablecimiento(newPaquete.idDestinoEstablecimiento);

      paqueteUpdate.push(
        UP(
          paquetes.idDestinoEstablecimiento,
          `${newPaquete.idDestinoEstablecimiento}`,
        ),
      );
    }

    if (newPaquete.destino !== undefined) {
      paqueteUpdate.push(UP(paquetes.destino, newPaquete.destino));
    }

    if (newPaquete.clave !== undefined) {
      paqueteUpdate.push(UP(paquetes.clave, newPaquete.clave));
    }

    if (newPaquete.montoCobrado !== undefined) {
      paqueteUpdate.push(
        UP(paquetes.montocobrado, `${newPaquete.montoCobrado}`),
      );
    }

    if (newPaquete.observacion !== undefined) {
      paqueteUpdate.push(UP(paquetes.observacion, newPaquete.observacion));
    }

    await DB.Update(paquetes())
      .set(paqueteUpdate)
      .where(eq(paquetes.idenvio, idpaquete))
      .execute();

    const data = await getpaqueteId(idpaquete);
    return data;
  }
}
