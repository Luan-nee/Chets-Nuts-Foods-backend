import { AND, DB, eq, neq, OR, ORQ, ORQD } from "zormz";
import { generateTables } from "../BD-Control.js";
import { roomsSocket } from "../types/global.js";

interface managerInterface {
  paquetes?: string[];
  salidatransporte?: string[];
}

export class ManagerSockets {
  static async getAdminControls() {
    const { salidatransporte } = generateTables();

    const ids = (await DB.Select([salidatransporte.idsalidatransporte])
      .from(salidatransporte())
      .where(ORQ(salidatransporte.estadotransporte, "INICIO", "EN CAMINO"))
      .execute()) as { idsalidatransporte: number }[];

    const idsSalida = ids.map((valor) => {
      return `SALIDATRANSPORTE_${valor.idsalidatransporte}`;
    });

    return { paquetes: undefined, salidatransporte: idsSalida };
  }

  static async getColaboradorControls(
    idcolaborador: number,
    establecimientoID: number,
  ) {
    const { salidatransporte, paquetes } = generateTables();

    const ids = (await DB.Select([salidatransporte.idsalidatransporte])
      .from(salidatransporte())
      .where(
        AND(
          neq(salidatransporte.estadotransporte, "FINALIZADO"),
          neq(salidatransporte.estadotransporte, "CANCELADO"),
          ORQ(
            eq(salidatransporte.idorigenestablecimiento, establecimientoID),
            eq(salidatransporte.iddestinoestablecimiento, establecimientoID),
          ),
        ),
      )
      .execute()) as { idsalidatransporte: number }[];

    const idsSalida = ids.map((valor) => {
      return `SALIDATRANSPORTE_${valor.idsalidatransporte}`;
    });

    const paquetesID = (await DB.Select([paquetes.idenvio])
      .from(paquetes())
      .where(ORQD(paquetes.idsalidatransporte, idsSalida))
      .execute()) as { idenvio: number }[];

    const idsPaquetes = paquetesID.map((valor) => {
      return `PAQUETES_${valor.idenvio}`;
    });

    return { paquetes: idsPaquetes, salidatransporte: idsSalida };
  }

  static async getUsuariosControls(iduser: number) {
    const { paquetes } = generateTables();

    const idpaq = (await DB.Select([paquetes.idenvio])
      .from(paquetes())
      .where(
        OR(
          eq(paquetes.idusuario, iduser),
          eq(paquetes.idusuarioDestino, iduser),
        ),
      )
      .execute()) as { idenvio: number }[];

    const idpaquetes = idpaq.map((dato) => {
      return `PAQUETES_${dato.idenvio}`;
    });

    return { paquetes: idpaquetes, salidatransporte: undefined };
  }

  static async managerControls(
    rol: roomsSocket,
    id: number,
    idEstablecimiento: number,
  ): Promise<managerInterface> {
    if (rol === "ADMINS") {
      const valores = await ManagerSockets.getAdminControls();
      return valores;
    }

    if (rol === "ESTABLECIMIENTO") {
      const valores = await ManagerSockets.getColaboradorControls(
        id,
        idEstablecimiento,
      );
      return valores;
    }

    if (rol === "CLIENTES") {
      const valores = await ManagerSockets.getUsuariosControls(id);
      return valores;
    }
    return { paquetes: undefined, salidatransporte: undefined };
  }
}
