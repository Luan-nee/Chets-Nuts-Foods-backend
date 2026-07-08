import { DB, eq } from "zormz";
import ConnectionGR from "../../../connection/connectionGR.js";
import { datosEmpresaType } from "../emisionGuia/guiaTypes.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";

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
  async getusuarioDNI(dni: string) {
    const datosEmpresa = await this.getDatosEmpresa();
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
