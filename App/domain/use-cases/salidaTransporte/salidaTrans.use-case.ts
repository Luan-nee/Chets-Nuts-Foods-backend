import {
  AND,
  ANDD,
  COUNT,
  DB,
  eq,
  MAYOR,
  MENOR,
  OR,
  ORQ,
  ORQD,
  SUM,
  UP,
  valor,
} from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CreateSalidaTransporteDto } from "../../dto/salidaTransporte/createSalidaTransporte.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { getSalidaTransporte } from "./getByIDSalTrans.use-case.js";
import { paramsDate } from "../../../types/params.js";
import { paginationResponseSuccess } from "../../../core/config/paginationResponseSucces.js";
import { NotificacionesUseCase } from "../notificaciones/notificaciones.use-case.js";
import { detallesSockets } from "../../../types/global.js";
import { PageDataDto } from "../../query-params/pageData.dto.js";

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
    const horas = salidaDto.horasalida.split(":");
    console.log(horas);
    if (horas! == undefined) {
      fechaCreate.setHours(horas[0], horas[1], 0, 0);
    }

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
        fechaCreate.toISOString().substring(0, 19).replace("T", " "),
      ])
      .Returning(salidatransporte.idsalidatransporte)
      .execute();

    if (valor === undefined || valor.length === 0) {
      throw CustomError.badRequest(
        "Ocurrio un error al momento de crear el transporte",
      );
    }

    const detallesUpdate: detallesSockets = {
      socketGroup: ["ADMINS", "ESTABLECIMIENTO", "SALIDATRANSPORTE"],
      update: true,
      querys: [
        {
          tabla: salidatransporte(),
          condicional: eq(salidatransporte.idsalidatransporte, valor[0]),
          setDatas: [UP(salidatransporte.estadotransporte, `EN CAMINO`)],
        },
      ],
      socketEmitData: "updateSalidaTransporte",
      contenido: "Carro saliendo a la hora acordada",
    };

    const notificacion: NotificacionesUseCase = {
      titulonotificacion: `El transporte con la hora ${salidaDto.fechaSalida} esta partiendo`,
      fechaejecute: salidaDto.fechaSalida,
      tipo: "socket",
      descripcion: JSON.stringify(detallesUpdate),
    };

    const horaAnticipada = new Date(salidaDto.fechaSalida);

    horaAnticipada.setMinutes(horaAnticipada.getMinutes() - 20);

    NotificacionesUseCase.createNotificacion({
      titulonotificacion: `Transporte a punto de partir`,
      tipo: "anuncio",
      fechaejecute: horaAnticipada,
      descripcion: `El transporte con el ID: ${valor[0]} esta a 20m de salir, por favor abordar las cosas o bien actualizar la fecha `,
    });

    NotificacionesUseCase.createNotificacion(notificacion);

    await DB.Update(vehiculosempresa())
      .set([UP(vehiculosempresa.estadovehiculo, "INACTIVO")])
      .where(eq(vehiculosempresa.idvehempresa, salidaDto.idVehiculo))
      .execute();

    await DB.Update(accesos())
      .set([UP(accesos.estadoacceso, "OCUPADO")])
      .where(eq(accesos.idacceso, salidaDto.idChoferAcceso))
      .execute();

    const getsalidaTransporte = await getSalidaTransporte(valor[0]);

    return getsalidaTransporte;
  }

  async getSalidas(idEstablecimiento: number, page: PageDataDto) {
    const { salidatransporte } = generateTables();

    let condicion = "";

    if (idEstablecimiento === 0 && page.salida) {
      condicion = eq(salidatransporte.estadotransporte, page.salida);
    }

    if (idEstablecimiento !== 0) {
      condicion = AND(
        eq(salidatransporte.iddestinoestablecimiento, idEstablecimiento),
        page.salida ? eq(salidatransporte.estadotransporte, page.salida) : null,
      );
    }
    console.log(page);

    const idsValores = await DB.Select([
      salidatransporte.idsalidatransporte,
      salidatransporte.estadotransporte,
      salidatransporte.fechasalida,
    ])
      .from(salidatransporte())
      .where(condicion)
      .OFFSET((page.page - 1) * 10)
      .LIMIT(10)
      .OrderBy({ idsalidatransporte: "DESC" })
      .execute();

    const [cantidadSalidaTransporte] = (await DB.Select([
      COUNT(salidatransporte.idsalidatransporte, "cantidad"),
    ])
      .from(salidatransporte())
      .where(condicion)
      .execute()) as { cantidad: number }[];

    const pageResponse = paginationResponseSuccess(
      cantidadSalidaTransporte.cantidad,
      page.page,
    );

    return { data: idsValores, pagination: pageResponse };
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
