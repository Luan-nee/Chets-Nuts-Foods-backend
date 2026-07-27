import { DB, eq } from "zormz";
import ConnectionGR from "../../../connection/connectionGR.js";
import { datosEmpresaType } from "../emisionGuia/guiaTypes.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { ResponserUserSunat } from "../../../types/global.js";
import { UsuariosUseCase } from "./Usuarios.use-case.js";
import { CACHE_TTL, cacheGlobal, CacheKeys } from "../../../consts.js";
import { CacheManager } from "../../../core/cache/controller.js";

interface userReturn {
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  edad?: number;
  dniuser: string;
  numero: string;
  sexo?: string;
  correo?: string;
}

export class UsuariosDefectUseCase {
  private async getDatosEmpresa(
    idDatoEmpresa?: number,
  ): Promise<datosEmpresaType> {
    const datosLocal = CacheManager.get<datosEmpresaType>(
      CacheKeys.dataEmpresa,
    );

    if (datosLocal) {
      return datosLocal;
    }

    const { datosempresa } = generateTables();

    const datosQuery = [
      datosempresa.codigoMtc,
      datosempresa.correo,
      datosempresa.denominacion,
      datosempresa.numeroRegistroMtc,
      datosempresa.ruc,
      datosempresa.claveAcceso,
      datosempresa.urlApi,
      datosempresa.tipoestadoempresa,
    ];

    const datos = DB.Select(datosQuery).from(datosempresa());

    if (idDatoEmpresa !== undefined) {
      datos.where(eq(datosempresa.idDatosEmpresa, idDatoEmpresa));
    }

    const [response] = (await datos
      .OrderBy({ idDatosEmpresa: "ASC" })
      .LIMIT(1)
      .execute(true)) as datosEmpresaType[];

    if (response === undefined) {
      throw CustomError.badRequest("Por favor ingrese los datos de la empresa");
    }

    CacheManager.set(CacheKeys.dataEmpresa, response, CACHE_TTL.HOUR);
    return response;
  }

  private async getUserLocal(dni: string) {
    const userLocal = CacheManager.get<ResponserUserSunat>(
      `${CacheKeys.USUARIOSUNAT}_${dni}`,
    );

    if (userLocal) {
      return userLocal;
    }

    const { usuarios } = generateTables();

    const [user] = (await DB.Select([
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.edad,
      usuarios.dniuser,
      usuarios.numero,
      usuarios.sexo,
      usuarios.edad,
      usuarios.correo,
    ])
      .from(usuarios())
      .where(eq(usuarios.dniuser, dni))
      .execute()) as userReturn[];

    if (!user) {
      return null;
    }

    const usertData: ResponserUserSunat = {
      apellido_materno: user.apellidomaterno,
      apellido_paterno: user.apellidopaterno,
      dni: user.dniuser,
      nombres: user.nombres,
      edad: user.edad,
      telefono: user.numero,
      sexo: user.sexo,
      correo: user.correo,
    };

    CacheManager.set(CacheKeys.USUARIOSUNAT, usertData, CACHE_TTL.TEN_MINUTES);
    return usertData;
  }

  async getusuarioDNI(dni: string): Promise<ResponserUserSunat> {
    const datosEmpresa = await this.getDatosEmpresa();

    const user0 = await this.getUserLocal(dni);

    if (user0 !== null) {
      return user0;
    }

    const user = await ConnectionGR.getdni(dni, datosEmpresa);
    if (!user.success) {
      throw CustomError.badRequest(
        "Este usuario no esta registrado en el sistema",
      );
    }
    const nuevo = new UsuariosUseCase();
    await nuevo.create({
      apellidomaterno: user.payload.apellido_materno,
      apellidopaterno: user.payload.apellido_paterno,
      nombre: user.payload.nombres,
      dni: user.payload.dni,
      sexo: "MASCULINO",
      edad: 20,
    });

    return user.payload;
  }

  async getusuarioRUC(ruc: string) {
    const datosEmpresa = await this.getDatosEmpresa();
    const user = await ConnectionGR.getRuc(ruc, datosEmpresa);
    if (!user.success) {
      throw CustomError.badRequest(
        "Este usuario no esta registrado en el sistema",
      );
    }
    console.log(user);
    return user;
  }
}
