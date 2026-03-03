import { DB, eq, OR } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateDatosEmpresaDto } from "../../dto/datosEmpresa/createDatosEmpresaDto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { Authpayload } from "../../../types/index.js";

export class DatosEmpresaUseCase {
  async create(dataEmpresa: CreateDatosEmpresaDto, userData: Authpayload) {
    if (userData.rol !== "ADMIN") {
      throw CustomError.badRequest(
        "Para confirmar los datos Empresariales tienes que ser ADMINISTRADOR",
      );
    }
    const { datosempresa } = generateTables();

    const noRepeat = await DB.Select([dataEmpresa.denominacion])
      .from(datosempresa())
      .where(
        OR(
          eq(datosempresa.codigoMtc, dataEmpresa.codigoMtc),
          eq(datosempresa.ruc, dataEmpresa.ruc),
        ),
      )
      .execute();

    if (noRepeat !== undefined) {
      if (noRepeat.length !== 0) {
        throw CustomError.badRequest(
          `Esta RUC o MTC ya esta en uso, no puedes usarlo 2 veces`,
        );
      }
    }

    const campos = [
      datosempresa.codigoMtc,
      datosempresa.ruc,
      datosempresa.numeroRegistroMtc,
      datosempresa.denominacion,
    ];
    const querys: string[] = [
      dataEmpresa.codigoMtc,
      dataEmpresa.ruc,
      dataEmpresa.numeroRegistroMtc,
      dataEmpresa.denominacion,
    ];

    if (dataEmpresa.urlApi !== undefined) {
      campos.push(datosempresa.urlApi);
      querys.push(dataEmpresa.urlApi);
    }

    if (dataEmpresa.claveAcceso !== undefined) {
      campos.push(datosempresa.claveAcceso);
      querys.push(dataEmpresa.claveAcceso);
    }

    const response = await DB.Insert(datosempresa(), campos)
      .Values(querys)
      .Returning(datosempresa.idDatosEmpresa)
      .execute();

    if (response === undefined) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de crear los datos de la empresa",
      );
    }
    if (response.length === 0) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de crear los datos de la empresa",
      );
    }

    return "ok";
  }
}
