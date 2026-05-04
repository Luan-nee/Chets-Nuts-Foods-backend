import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateSeguimientoDto } from "../../dto/seguimiento/createSeguimiento.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";

export class CreateSeguimientoUseCase {
  async validatePaquete(id: number) {
    const { paquetes } = generateTables();

    const datos = (await DB.Select([paquetes.idenvio])
      .from(paquetes())
      .where(eq(paquetes.idenvio, id))
      .execute()) as { idenvio: number }[];

    if (datos.length === 0) {
      throw CustomError.badRequest(`El paquete con el ID: ${id} no existe`);
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

    const query = [seguimientopaquetes.titulo];
    const data: any[] = [seguimiento.titulo];

    await this.validatePaquete(id);
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
}
