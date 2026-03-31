import { AND, DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateSalidaTransporteDto } from "../../dto/salidaTransporte/createSalidaTransporte.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";

interface validateResponse {
  response: boolean;
  message: string;
}

interface parameterValidate {
  idChoferAcceso: number;
  idVehiculo: number;
  idorigenestablecimiento: number;
}

export class SalidaTransporteUseCase {
  async validate({
    idChoferAcceso,
    idVehiculo,
    idorigenestablecimiento,
  }: parameterValidate): Promise<validateResponse> {
    const { accesos, vehiculosempresa, establecimientos } = generateTables();

    const resultadoAcceso = await DB.Select([accesos.idacceso])
      .from(accesos())
      .where(
        AND(
          eq(accesos.idacceso, idChoferAcceso),
          eq(accesos.estado, true),
          eq(accesos.tipos, "CHOFER"),
        ),
      )
      .execute();

    if (resultadoAcceso.length === 0) {
      return { response: false, message: "Este acceso no existe" };
    }

    const resultadoVehiculo = await DB.Select([vehiculosempresa.idvehempresa])
      .from(vehiculosempresa())
      .where(
        AND(
          eq(vehiculosempresa.idvehempresa, idVehiculo),
          eq(vehiculosempresa.estado, true),
        ),
      )
      .execute();
    if (resultadoVehiculo.length === 0) {
      return {
        response: false,
        message: "Este vehiculo no esta registrado o activo",
      };
    }

    const resultadoEstablecimiento = await DB.Select([establecimientos.idEst])
      .from(establecimientos())
      .where(
        AND(
          eq(establecimientos.idEst, idorigenestablecimiento),
          eq(establecimientos.activo, true),
        ),
      )
      .execute();

    if (resultadoEstablecimiento.length === 0) {
      return {
        response: false,
        message: "Establecimiento no encontrado",
      };
    }

    return {
      response: true,
      message: "OK",
    };
  }

  async create(salidaDto: CreateSalidaTransporteDto) {
    const validateRes = await this.validate({
      idVehiculo: salidaDto.idVehiculo,
      idChoferAcceso: salidaDto.idChoferAcceso,
      idorigenestablecimiento: salidaDto.idOrigenEstablecimiento,
    });

    if (!validateRes.response) {
      throw CustomError.badRequest(validateRes.message);
    }

    const { salidatransporte } = generateTables();

    const valor = await DB.Insert(salidatransporte(), [
      salidatransporte.idvehiculo,
      salidatransporte.idchoferacceso,
      salidatransporte.idorigenestablecimiento,
      salidatransporte.fechasalida,
    ])
      .Values([
        salidaDto.idVehiculo,
        salidaDto.idChoferAcceso,
        salidaDto.idOrigenEstablecimiento,
        salidaDto.fechaSalida.toString(),
      ])
      .Returning(salidatransporte.idsalidatransporte)
      .execute();

    if (valor !== undefined) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de crear el transporte",
      );
    }
  }
}
