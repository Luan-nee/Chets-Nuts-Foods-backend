import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import {
  choferType,
  salidaTransporteType,
  transporteType,
  vehiculoType,
} from "../../../types/global.js";

export async function getSalidaTransporte(
  id: number,
): Promise<salidaTransporteType> {
  const { salidatransporte, vehiculosempresa, accesos, usuarios } =
    generateTables();

  const [transporte] = (await DB.Select([
    salidatransporte.idsalidatransporte,
    salidatransporte.estadotransporte,
    salidatransporte.fechasalida,
    salidatransporte.fechacreado,
    salidatransporte.fechafinalizado,
    salidatransporte.idvehiculo,
    salidatransporte.idchoferacceso,
  ])
    .from(salidatransporte())
    .where(eq(salidatransporte.idsalidatransporte, id))
    .execute()) as transporteType[];

  const [vehiculo] = (await DB.Select([
    vehiculosempresa.placa,
    vehiculosempresa.marca,
    vehiculosempresa.modelo,
    vehiculosempresa.capacidadCarga,
  ])
    .from(vehiculosempresa())
    .where(eq(vehiculosempresa.idvehempresa, transporte.idvehiculo))
    .execute()) as vehiculoType[];

  const [chofer] = (await DB.Select([
    accesos.idacceso,
    usuarios.nombres,
    usuarios.apellidomaterno,
    usuarios.apellidopaterno,
    usuarios.rucuser,
    usuarios.numeroLicenciaConducir,
    usuarios.edad,
    usuarios.numero,
  ])
    .from(accesos())
    .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser, false))
    .where(eq(accesos.idacceso, transporte.idchoferacceso))
    .execute()) as choferType[];
  return {
    salidaTransporte: transporte,
    choferUser: chofer,
    vehiculo,
  };
}
