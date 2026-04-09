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
  const {
    salidatransporte,
    vehiculosempresa,
    accesos,
    usuarios,
    establecimientos,
  } = generateTables();

  const [transporte] = (await DB.Select([
    salidatransporte.idsalidatransporte,
    salidatransporte.estadotransporte,
    salidatransporte.fechasalida,
    salidatransporte.fechacreado,
    salidatransporte.fechafinalizado,
    salidatransporte.idvehiculo,
    salidatransporte.idchoferacceso,
    salidatransporte.idorigenestablecimiento,
    salidatransporte.iddestinoestablecimiento,
  ])
    .from(salidatransporte())
    .where(eq(salidatransporte.idsalidatransporte, id))
    .execute()) as transporteType[];

  const [vehiculo] = (await DB.Select([
    vehiculosempresa.placa,
    vehiculosempresa.marca,
    vehiculosempresa.modelo,
    vehiculosempresa.capacidadCarga,
    vehiculosempresa.estadovehiculo,
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

  const [origenEstablecimiento] = await DB.Select([
    establecimientos.nombreEst,
    establecimientos.ubigeo,
    establecimientos.tipoestablecimiento,
    establecimientos.departamento,
    establecimientos.codigoSunat,
    establecimientos.provincia,
    establecimientos.fechaCreacion,
  ])
    .from(establecimientos())
    .where(eq(establecimientos.idEst, transporte.idorigenestablecimiento))
    .execute();

  const [destinoEstablecimiento] = await DB.Select([
    establecimientos.idEst,
    establecimientos.nombreEst,
    establecimientos.ubigeo,
    establecimientos.tipoestablecimiento,
    establecimientos.departamento,
    establecimientos.codigoSunat,
    establecimientos.provincia,
    establecimientos.fechaCreacion,
  ])
    .from(establecimientos())
    .where(eq(establecimientos.idEst, transporte.iddestinoestablecimiento))
    .execute();

  return {
    salidaTransporte: transporte,
    choferUser: chofer,
    vehiculo,
    origenEstablecimiento,
    destinoEstablecimiento,
  };
}
