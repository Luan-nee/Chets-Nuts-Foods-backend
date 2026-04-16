import { DB, eq, ORQ, UP } from "zormz";
import { UpdateSalidaTransporteDto } from "../../dto/salidaTransporte/updateSalidaTransporte.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { UpdateParam } from "../../../consts.js";
import {
  accesoEstado,
  estadoVehiculo,
  salidaTransType,
  tipeUser,
} from "../../../types/global.js";
import { getSalidaTransporte } from "./getByIDSalTrans.use-case.js";

interface salidaTranposteResult {
  idsalidatransporte: number;
  idvehiculo: number;
  idchoferacceso: number;
  iddestinoestablecimiento: number;
  idorigenestablecimiento: number;
  estadotransporte: salidaTransType;
}

interface vehiculoEmpresaResult {
  estadovehiculo: estadoVehiculo;
  idvehempresa: number;
  numeroHabilitacion: string;
}

interface choferAccesoResult {
  idacceso: number;
  tipos: tipeUser;
  estadoacceso: accesoEstado;
  estado: boolean;
}
export class UpdateSalidaTransUseCase {
  async updateVehiculo(idNewVehiculo: number, idDeferVehiculo: number) {
    const { vehiculosempresa } = generateTables();
    const vehiculoData = (await DB.Select([
      vehiculosempresa.estadovehiculo,
      vehiculosempresa.idvehempresa,
      vehiculosempresa.numeroHabilitacion,
    ])
      .from(vehiculosempresa())
      .where(ORQ(vehiculosempresa.idvehempresa, idNewVehiculo, idDeferVehiculo))
      .execute()) as vehiculoEmpresaResult[];

    if (vehiculoData.length !== 2) {
      throw CustomError.badRequest(`El vehiculo a agregar no existe`);
    }

    if (vehiculoData[0].estadovehiculo !== "OPERATIVO") {
      throw CustomError.badRequest(
        `El vehiculo ${vehiculoData[0].idvehempresa} no esta operativo`,
      );
    }

    if (vehiculoData[1].estadovehiculo === "OCUPADO") {
      await DB.Update(vehiculosempresa())
        .set([UP(vehiculosempresa.estadovehiculo, "OPERATIVO")])
        .where(eq(vehiculosempresa.idvehempresa, idDeferVehiculo))
        .execute();
    }

    await DB.Update(vehiculosempresa())
      .set([UP(vehiculosempresa.estadovehiculo, "OCUPADO")])
      .where(eq(vehiculosempresa.idvehempresa, idDeferVehiculo))
      .execute();
  }

  async updateChoferAcceso(idNewchofer: number, idDefetChoder: number) {
    const { accesos } = generateTables();

    const datosChoder = (await DB.Select([
      accesos.idacceso,
      accesos.tipos,
      accesos.estadoacceso,
      accesos.estado,
    ])
      .from(accesos())
      .where(ORQ(accesos.idacceso, idNewchofer, idDefetChoder))
      .execute()) as choferAccesoResult[];

    if (datosChoder.length !== 2) {
      throw CustomError.badRequest("No se encontro al nuevo usuario");
    }

    if (datosChoder[1].estadoacceso !== "DISPONIBLE") {
      throw CustomError.badRequest("EL CHOFER SE ENCUENTRA OCUPADO");
    }

    if (datosChoder[1].estado === false) {
      throw CustomError.badRequest("El chofer se encuebtra INHABILITADO");
    }

    await DB.Update(accesos())
      .set([UP(accesos.estado, "DISPONIBLE")])
      .where(eq(accesos.idacceso, idDefetChoder))
      .execute();

    await DB.Update(accesos())
      .set([UP(accesos.estado, "OCUPADO")])
      .where(eq(accesos.idacceso, idNewchofer))
      .execute();
  }

  async initPedidos(
    estado: salidaTransType,
    idVehiculo: number,
    idChofer: number,
  ) {
    const { vehiculosempresa, accesos } = generateTables();
    if (estado === "CANCELADO" || estado === "FINALIZADO") {
      await DB.Update(vehiculosempresa())
        .set([UP(vehiculosempresa.estadovehiculo, "OPERATIVO")])
        .where(eq(vehiculosempresa.idvehempresa, idVehiculo))
        .execute();

      await DB.Update(accesos())
        .set([UP(accesos.estadoacceso, "DISPONIBLE")])
        .where(eq(accesos.idacceso, idChofer))
        .execute();
    }
  }

  async execute(data: UpdateSalidaTransporteDto) {
    const { salidatransporte } = generateTables();
    const updateData = {
      nuevoEstablecimientoDestino: 0,
      antiguoEstablecimientoDestino: 0,
      nuevoEstablecimientoInicio: 0,
      antiguoEstablecimientoIncio: 0,
    };

    const idValidate = (await DB.Select([
      salidatransporte.idsalidatransporte,
      salidatransporte.idvehiculo,
      salidatransporte.idchoferacceso,
      salidatransporte.iddestinoestablecimiento,
      salidatransporte.idorigenestablecimiento,
      salidatransporte.estadotransporte,
    ])
      .from(salidatransporte())
      .where(eq(salidatransporte.idsalidatransporte, data.idsalidatransporte))
      .execute()) as salidaTranposteResult[];

    if (idValidate.length === 0) {
      throw CustomError.badRequest(
        `La salida de transporte con el ID ${data.idsalidatransporte} no existe`,
      );
    }

    if (idValidate[0].estadotransporte !== "INICIO") {
      throw CustomError.badRequest(
        `El transporte esta  en ${idValidate[0].estadotransporte} , no se puede Actualizar `,
      );
    }

    const datosUpdate: UpdateParam[] = [];

    if (data.idVehiculo !== undefined) {
      datosUpdate.push(UP(salidatransporte.idvehiculo, `${data.idVehiculo}`));
      await this.updateVehiculo(data.idVehiculo, idValidate[0].idvehiculo);
    }

    if (data.idChoferAcceso !== undefined) {
      datosUpdate.push(
        UP(salidatransporte.idchoferacceso, `${data.idChoferAcceso}`),
      );
      await this.updateChoferAcceso(
        data.idChoferAcceso,
        idValidate[0].idchoferacceso,
      );
    }

    if (data.idDestinoEstablecimiento !== undefined) {
      datosUpdate.push(
        UP(
          salidatransporte.iddestinoestablecimiento,
          `${data.idDestinoEstablecimiento}`,
        ),
      );
      updateData.nuevoEstablecimientoDestino = data.idDestinoEstablecimiento;
      updateData.antiguoEstablecimientoDestino =
        idValidate[0].iddestinoestablecimiento;
    }

    if (data.idOrigenEstablecimiento !== undefined) {
      datosUpdate.push(
        UP(
          salidatransporte.idorigenestablecimiento,
          `${data.idOrigenEstablecimiento}`,
        ),
      );

      updateData.nuevoEstablecimientoInicio = data.idOrigenEstablecimiento;
      updateData.antiguoEstablecimientoIncio =
        idValidate[0].idorigenestablecimiento;
    }

    if (data.fechaSalida !== undefined) {
      datosUpdate.push(
        UP(salidatransporte.fechasalida, data.fechaSalida.toISOString()),
      );
    }

    if (data.estadoTransporte !== undefined) {
      datosUpdate.push(
        UP(salidatransporte.estadotransporte, data.estadoTransporte),
      );

      await this.initPedidos(
        data.estadoTransporte,
        idValidate[0].idvehiculo,
        idValidate[0].idchoferacceso,
      );
    }

    if (datosUpdate.length === 0) {
      throw CustomError.badRequest("No hay datos para actualizar");
    }

    await DB.Update(salidatransporte())
      .set(datosUpdate)
      .where(eq(salidatransporte.idsalidatransporte, data.idsalidatransporte))
      .execute();

    const salidaTransporteNew = await getSalidaTransporte(
      data.idsalidatransporte,
    );
    return {
      data: salidaTransporteNew,
      update: updateData,
    };
  }
}
