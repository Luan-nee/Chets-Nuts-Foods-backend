import { DB, eq, OR, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateDatosEmpresaDto } from "../../dto/datosEmpresa/createDatosEmpresaDto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { Authpayload } from "../../../types/index.js";
import { UpdateDatosEmpresaDTO } from "../../dto/datosEmpresa/updateDatosEmpresaDto.js";
import { UpdateParam } from "../../../consts.js";

interface datosEmpresaResponse {
  claveAcceso: string;
  codigoMtc: string;
  correo: string;
  denominacion: string;
  fechavigenciaregistro: string;
  numeroRegistroMtc: string;
  ruc: string;
}

export class DatosEmpresaUseCase {
  async create(dataEmpresa: CreateDatosEmpresaDto, userData: Authpayload) {
    console.log(dataEmpresa);
    if (userData.rol !== "ADMIN") {
      throw CustomError.badRequest(
        "Para confirmar los datos Empresariales tienes que ser ADMINISTRADOR",
      );
    }
    const { datosempresa } = generateTables();

    const noRepeat = await DB.Select([datosempresa.denominacion])
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
      datosempresa.correo,
      datosempresa.fechavigenciaregistro,
    ];
    const querys: any[] = [
      dataEmpresa.codigoMtc,
      dataEmpresa.ruc,
      dataEmpresa.numeroRegistroMtc,
      dataEmpresa.denominacion,
      dataEmpresa.correo,
      dataEmpresa.fechaVigenciaRegistroMtc,
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

  async getAll() {
    const { datosempresa } = generateTables();

    const [datos] = (await DB.Select([
      datosempresa.claveAcceso,
      datosempresa.codigoMtc,
      datosempresa.correo,
      datosempresa.denominacion,
      datosempresa.fechavigenciaregistro,
      datosempresa.numeroRegistroMtc,
      datosempresa.ruc,
    ])
      .from(datosempresa())
      .where(eq(datosempresa.idDatosEmpresa, 1))
      .execute()) as (datosEmpresaResponse | undefined)[];

    if (datos === undefined) {
      throw CustomError.badRequest("No existe datos agregados");
    }
    return datos;
  }

  async update(update: UpdateDatosEmpresaDTO) {
    const { datosempresa } = generateTables();

    const querys: UpdateParam[] = [];

    if (update.ruc !== undefined) {
      querys.push(UP(datosempresa.ruc, update.ruc));
    }

    if (update.claveAcceso !== undefined) {
      querys.push(UP(datosempresa.claveAcceso, update.claveAcceso));
    }

    if (update.codigoMtc !== undefined) {
      querys.push(UP(datosempresa.codigoMtc, update.codigoMtc));
    }

    if (update.correo !== undefined) {
      querys.push(UP(datosempresa.correo, update.correo));
    }

    if (update.denominacion !== undefined) {
      querys.push(UP(datosempresa.denominacion, update.denominacion));
    }

    if (update.fechaVigenciaRegistroMtc !== undefined) {
      querys.push(
        UP(
          datosempresa.fechavigenciaregistro,
          update.fechaVigenciaRegistroMtc.toISOString(),
        ),
      );
    }

    if (update.urlApi !== undefined) {
      querys.push(UP(datosempresa.urlApi, update.urlApi));
    }

    await DB.Update(datosempresa())
      .set(querys)
      .where(eq(datosempresa.idDatosEmpresa, 1))
      .execute();
  }
}
