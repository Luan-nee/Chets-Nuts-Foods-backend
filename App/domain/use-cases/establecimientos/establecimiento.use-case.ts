import { AND, DB, eq, OR } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { CreateEstablecimientoDto } from "../../dto/establecimientos/createEstablecimiento.dto.js";
import { CreateEstablecimiento } from "../../../SQL/atajosSql.js";

export class EstablecimientosUseCase {
  private async getEstablecimientoId(id: number) {
    const { establecimientos, usuarios } = generateTables();
    const response = await DB.Select([
      establecimientos.idEst,
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      establecimientos.codigoSunat,
      establecimientos.departamento,
      establecimientos.descripcion,
      establecimientos.distrito,
      establecimientos.provincia,
      establecimientos.latitud,
      establecimientos.longitud,
      establecimientos.tipoestablecimiento,
      establecimientos.ubigeo,
    ])
      .from(establecimientos())
      .innerJOIN(
        usuarios(),
        eq(establecimientos.idUsuarioResponsable, usuarios.iduser, false),
      )
      .where(eq(establecimientos.idEst, id))
      .execute();

    if (response === undefined) {
      throw CustomError.badRequest(
        "No se pudo obtener al establecimiento o no existe",
      );
    }

    if (response.length === 0) {
      throw CustomError.badRequest("Error al crear el establecimiento");
    }

    return response;
  }

  async create(dto: CreateEstablecimientoDto, idUser: number) {
    const { establecimientos } = generateTables();

    const response = await DB.Select([establecimientos.nombreEst])
      .where(
        OR(
          AND(
            eq(establecimientos.latitud, dto.latitud),
            eq(establecimientos.longitud, dto.longitud),
          ),
          eq(establecimientos.nombreEst, dto.nombreEstablecimiento),
          dto.codigoSunat === undefined
            ? ""
            : eq(establecimientos.codigoSunat, dto.codigoSunat),
        ),
      )
      .execute(true);

    if (response !== undefined) {
      if (response.length > 0) {
        throw CustomError.badRequest(
          "El nombre , ubicacion o codigo de la sunat son unicos no pueden repetirse",
        );
      }
    }

    const id = await CreateEstablecimiento(dto);
    return id;
  }
}
