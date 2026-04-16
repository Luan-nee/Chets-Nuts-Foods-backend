import { AND, ANDD, DB, eq, MAYOR, MENOR, OR, ORQ, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateSalidaTransporteDto } from "../../dto/salidaTransporte/createSalidaTransporte.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { getSalidaTransporte } from "./getByIDSalTrans.use-case.js";
import { paramsDate } from "../../../types/params.js";

interface validateResponse {
  response: boolean;
  message: string;
}

interface parameterValidate {
  idChoferAcceso: number;
  idVehiculo: number;
  idorigenestablecimiento: number;
  iddestinoestablecimiento: number;
}

export class SalidaTransporteUseCase {
  async validate({
    idChoferAcceso,
    idVehiculo,
    idorigenestablecimiento,
    iddestinoestablecimiento,
  }: parameterValidate): Promise<validateResponse> {
    const { accesos, vehiculosempresa, establecimientos } = generateTables();

    const resultadoAcceso = await DB.Select([accesos.idacceso])
      .from(accesos())
      .where(
        AND(
          eq(accesos.idacceso, idChoferAcceso),
          eq(accesos.estado, true),
          eq(accesos.estadoacceso, "DISPONIBLE"),
          eq(accesos.tipos, "CHOFER"),
        ),
      )
      .execute();

    if (resultadoAcceso.length === 0) {
      return {
        response: false,
        message: "Este acceso no existe o esta ocupado",
      };
    }

    const resultadoVehiculo = await DB.Select([vehiculosempresa.idvehempresa])
      .from(vehiculosempresa())
      .where(
        AND(
          eq(vehiculosempresa.idvehempresa, idVehiculo),
          eq(vehiculosempresa.estadovehiculo, "OPERATIVO"),
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
        message: `Establecimiento Origen no encontrado no encontrado`,
      };
    }

    const establecimientoSalida = await DB.Select([establecimientos.idEst])
      .from(establecimientos())
      .where(
        AND(
          eq(establecimientos.idEst, iddestinoestablecimiento),
          eq(establecimientos.activo, true),
        ),
      )
      .execute();

    if (establecimientoSalida.length === 0) {
      return {
        response: false,
        message: "Establecimiento de destino no encontrado",
      };
    }

    return {
      response: true,
      message: "OK",
    };
  }

  async create(salidaDto: CreateSalidaTransporteDto) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCreate = new Date(salidaDto.fechaSalida);
    fechaCreate.setHours(0, 0, 0, 0);

    if (fechaCreate < hoy) {
      throw CustomError.badRequest(
        "La fecha no puede ser Inferior a la de hoy",
      );
    }

    const validateRes = await this.validate({
      idVehiculo: salidaDto.idVehiculo,
      idChoferAcceso: salidaDto.idChoferAcceso,
      idorigenestablecimiento: salidaDto.idOrigenEstablecimiento,
      iddestinoestablecimiento: salidaDto.idDestinoEstablecimiento,
    });

    if (!validateRes.response) {
      throw CustomError.badRequest(validateRes.message);
    }

    const { salidatransporte, vehiculosempresa, accesos } = generateTables();

    const carroDisponible = await DB.Select([
      salidatransporte.idsalidatransporte,
    ])
      .from(salidatransporte())
      .where(
        AND(
          eq(salidatransporte.idchoferacceso, salidaDto.idChoferAcceso),
          ORQ(salidatransporte.estadotransporte, "RESERVADO", "OCUPADO"),
        ),
      )
      .execute();

    if (carroDisponible.length > 0) {
      throw CustomError.badRequest("Vehiculo ocupado");
    }

    const valor = await DB.Insert(salidatransporte(), [
      salidatransporte.idvehiculo,
      salidatransporte.idchoferacceso,
      salidatransporte.idorigenestablecimiento,
      salidatransporte.iddestinoestablecimiento,
      salidatransporte.fechasalida,
    ])
      .Values([
        salidaDto.idVehiculo,
        salidaDto.idChoferAcceso,
        salidaDto.idOrigenEstablecimiento,
        salidaDto.idDestinoEstablecimiento,
        salidaDto.fechaSalida.toISOString(),
      ])
      .Returning(salidatransporte.idsalidatransporte)
      .execute();

    if (valor === undefined || valor.length === 0) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de crear el transporte",
      );
    }

    await DB.Update(vehiculosempresa())
      .set([UP(vehiculosempresa.estadovehiculo, "OCUPADO")])
      .where(eq(vehiculosempresa.idvehempresa, salidaDto.idVehiculo))
      .execute();

    await DB.Update(accesos())
      .set([UP(accesos.estadoacceso, "OCUPADO")])
      .where(eq(accesos.idacceso, salidaDto.idChoferAcceso))
      .execute();

    const getsalidaTransporte = await getSalidaTransporte(valor[0]);

    return getsalidaTransporte;
  }

  async getSalidas(idEstablecimiento: number) {
    const { salidatransporte } = generateTables();

    let condicion = "";

    if (idEstablecimiento === 0) {
      condicion = ORQ(salidatransporte.estadotransporte, "INICIO", "EN CAMINO");
    } else {
      condicion = AND(
        ORQ(salidatransporte.estadotransporte, "INICIO", "EN CAMINO"),
        OR(
          eq(salidatransporte.iddestinoestablecimiento, idEstablecimiento),
          eq(salidatransporte.iddestinoestablecimiento, idEstablecimiento),
        ),
      );
    }

    const idsValores = await DB.Select([salidatransporte.idsalidatransporte])
      .from(salidatransporte())
      .where(condicion)
      .execute();
    return idsValores;
  }

  async historial(fecha: paramsDate) {
    const { salidatransporte } = generateTables();

    let condicion: string[] = [];

    if (fecha.fechaInicio !== undefined) {
      condicion.push(
        MAYOR(salidatransporte.fechacreado, fecha.fechaInicio.toISOString()),
      );
    }

    if (fecha.fechaFinal !== undefined) {
      condicion.push(
        MENOR(salidatransporte.fechafinalizado, fecha.fechaFinal.toISOString()),
      );
    }

    if (fecha.estado !== undefined) {
      condicion.push(eq(salidatransporte.estadotransporte, fecha.estado));
    }

    let andCondicion = "";

    if (condicion.length !== 0) {
      andCondicion += ANDD(condicion);
    }

    const filtrados = await DB.Select([
      salidatransporte.idsalidatransporte,
      salidatransporte.estadotransporte,
      salidatransporte.fechacreado,
      salidatransporte.fechafinalizado,
      salidatransporte.fechasalida,
    ])
      .from(salidatransporte())
      .where(andCondicion)
      .execute();

    return filtrados;
  }

  async getByID(id: number) {
    const { salidatransporte } = generateTables();

    const elemento = await DB.Select([salidatransporte.idsalidatransporte])
      .from(salidatransporte())
      .where(eq(salidatransporte.idsalidatransporte, id))
      .execute();

    if (elemento.length === 0) {
      throw CustomError.badRequest("Esta salida no existe");
    }

    const salida = await getSalidaTransporte(id);
    return salida;
  }
}
