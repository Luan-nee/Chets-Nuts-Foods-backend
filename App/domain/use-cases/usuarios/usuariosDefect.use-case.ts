import { DB, eq } from "zormz";
import ConnectionGR from "../../../connection/connectionGR.js";
import { datosEmpresaType } from "../emisionGuia/guiaTypes.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { ResponserUserSunat, ResponseSunatDni } from "../../../types/global.js";

interface userReturn {
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  edad: number;
  dniuser: string;
  numero: string;
}

export class UsuariosDefectUseCase {
  private async getDatosEmpresa(
    idDatoEmpresa?: number,
  ): Promise<datosEmpresaType> {
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

    return response;
  }

  private async getUserLocal(dni: string) {
    const { usuarios } = generateTables();

    const [user] = (await DB.Select([
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.edad,
      usuarios.dniuser,
      usuarios.numero,
    ])
      .from(usuarios())
      .where(eq(usuarios.dniuser, dni))
      .execute()) as userReturn[];

    if (!user) {
      return null;
    }

    return {
      apellido_materno: user.apellidomaterno,
      apellido_paterno: user.apellidopaterno,
      dni: user.dniuser,
      nombres: user.nombres,
      edad: user.edad,
      telefono: user.numero,
    } as ResponserUserSunat;
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
    console.log(user);
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
