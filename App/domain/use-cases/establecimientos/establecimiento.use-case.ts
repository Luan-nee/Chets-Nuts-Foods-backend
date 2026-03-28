import { AND, DB, eq, OR, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { CreateEstablecimientoDto } from "../../dto/establecimientos/createEstablecimiento.dto.js";
import { CreateEstablecimiento } from "../../../SQL/atajosSql.js";
import { UpdateEstablecimientoDTO } from "../../dto/establecimientos/updateEstablecimiento.dto.js";
import { UpdateParam } from "../../../consts.js";

export class EstablecimientosUseCase {
  async getEstablecimientoId(id: number) {
    const { establecimientos, usuarios, accesos } = generateTables();
    const response = await DB.Select([
      establecimientos.idEst,
      `${accesos.idacceso} AS iduser`,
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.numero,
      establecimientos.codigoSunat,
      establecimientos.departamento,
      establecimientos.descripcion,
      establecimientos.distrito,
      establecimientos.provincia,
      establecimientos.latitud,
      establecimientos.longitud,
      establecimientos.tipoestablecimiento,
      establecimientos.ubigeo,
      establecimientos.activo,
      establecimientos.fechaCreacion,
    ])
      .from(establecimientos())
      .innerJOIN(
        accesos(),
        eq(establecimientos.idUsuarioResponsable, accesos.idusuario, false),
      )
      .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser, false))
      .where(eq(establecimientos.idEst, id))
      .LIMIT(1)
      .execute(true);

    if (response.length === 0) {
      throw CustomError.badRequest("Error al crear el establecimiento");
    }

    return response;
  }

  async getAll() {
    const { establecimientos, usuarios } = generateTables();
    const response = await DB.Select([
      establecimientos.nombreEst,
      establecimientos.codigoSunat,
      establecimientos.direccion,
      establecimientos.distrito,
      establecimientos.provincia,
      establecimientos.tipoestablecimiento,
      `${establecimientos.activo} AS estado`,
      establecimientos.descripcion,
      establecimientos.idEst,
      usuarios.nombres,
    ])
      .from(establecimientos())
      .innerJOIN(
        usuarios(),
        eq(establecimientos.idUsuarioResponsable, usuarios.iduser, false),
      )
      .execute();

    return response;
  }

  async create(dto: CreateEstablecimientoDto) {
    const { establecimientos, accesos } = generateTables();

    const verifyAcceso = await DB.Select([accesos.correo, accesos.estado])
      .from(accesos())
      .where(eq(accesos.idacceso, dto.idResponsable))
      .execute();

    if (verifyAcceso.length === 0) {
      throw CustomError.badRequest("Accesos de usuario inexistente");
    }

    const response = await DB.Select([establecimientos.nombreEst])
      .from(establecimientos())
      .where(
        OR(
          AND(
            eq(establecimientos.latitud, dto.latitud),
            eq(establecimientos.longitud, dto.longitud),
          ),
          eq(establecimientos.nombreEst, dto.nombreEstablecimiento),
        ),
      )
      .execute();

    if (response.length > 0) {
      throw CustomError.badRequest(
        "El nombre , ubicacion o codigo de la sunat son unicos no pueden repetirse",
      );
    }

    const id = await CreateEstablecimiento(dto);
    return id;
  }

  async update(estUpd: UpdateEstablecimientoDTO) {
    const { establecimientos } = generateTables();

    const query: UpdateParam[] = [];

    if (estUpd.nombreEstablecimiento !== undefined) {
      query.push(UP(establecimientos.nombreEst, estUpd.nombreEstablecimiento));
    }

    if (estUpd.idResponsable !== undefined) {
      query.push(
        UP(establecimientos.idUsuarioResponsable, `${estUpd.idResponsable}`),
      );
    }

    if (estUpd.codigoSunat !== undefined) {
      query.push(UP(establecimientos.codigoSunat, estUpd.codigoSunat));
    }
    if (estUpd.direccion !== undefined) {
      query.push(UP(establecimientos.direccion, estUpd.direccion));
    }
    if (estUpd.descripcion !== undefined) {
      query.push(UP(establecimientos.descripcion, estUpd.descripcion));
    }

    if (estUpd.latitud !== undefined) {
      query.push(UP(establecimientos.latitud, estUpd.latitud));
    }
    if (estUpd.longitud !== undefined) {
      query.push(UP(establecimientos.longitud, estUpd.longitud));
    }

    if (estUpd.distrito !== undefined) {
      query.push(UP(establecimientos.distrito, estUpd.distrito));
    }

    if (estUpd.provincia !== undefined) {
      query.push(UP(establecimientos.provincia, estUpd.provincia));
    }

    if (estUpd.departamento !== undefined) {
      query.push(UP(establecimientos.departamento, estUpd.departamento));
    }
    if (estUpd.ubigeo !== undefined) {
      query.push(UP(establecimientos.ubigeo, estUpd.ubigeo));
    }

    if (estUpd.tipoEstado !== undefined) {
      query.push(UP(establecimientos.tipoestablecimiento, estUpd.tipoEstado));
    }

    if (estUpd.activo !== undefined) {
      query.push(UP(establecimientos.activo, `${estUpd.activo}`, true));
    }

    if (query.length === 0) {
      throw CustomError.badRequest("Error No hay campos para actualizar");
    }
    console.log(query);
    const update = await DB.Update(establecimientos())
      .set(query)
      .where(eq(establecimientos.idEst, estUpd.idEstablecimiento))
      .execute();

    console.log(update);

    const establecimientoResponse = await this.getEstablecimientoId(
      estUpd.idEstablecimiento,
    );

    console.log(establecimientoResponse);
    return establecimientoResponse;
  }
}
