import { DB, eq, ORQ } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { estadoPaquete } from "../../../types/global.js";
import { CustomError } from "../../../core/res/Custom.error.js";

interface paqueteResponse {
  idenvio: number;
  idusuario: number;
  idusuarioDestino: number;
  idsalidatransporte: number;
  idDestinoEstablecimiento?: number | null;
  destino?: string;
  clave: string;
  montocobrado: number;
  estadopaquete: estadoPaquete;
  observacion?: string;
  fechacreado: Date;
}

interface usuariosResponse {
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  dniuser: string;
  numero: string;
  correo: string;
}

interface establecimientoResponse {
  nombreEst: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

export async function getpaqueteId(idPaquete: number) {
  const { paquetes, usuarios, establecimientos } = generateTables();

  const [datosPaquete] = (await DB.Select([
    paquetes.idenvio,
    paquetes.idusuario,
    paquetes.idusuarioDestino,
    paquetes.idsalidatransporte,
    paquetes.idDestinoEstablecimiento,
    paquetes.destino,
    paquetes.clave,
    paquetes.montocobrado,
    paquetes.estadopaquete,
    paquetes.observacion,
    paquetes.fechacreado,
  ])
    .from(paquetes())
    .where(eq(paquetes.idenvio, idPaquete))
    .execute()) as paqueteResponse[];

  const usuariosResponse = (await DB.Select([
    usuarios.nombres,
    usuarios.apellidomaterno,
    usuarios.apellidopaterno,
    usuarios.dniuser,
    usuarios.numero,
    usuarios.correo,
  ])
    .from(usuarios())
    .where(
      ORQ(
        usuarios.iduser,
        datosPaquete.idusuario,
        datosPaquete.idusuarioDestino,
      ),
    )
    .execute()) as usuariosResponse[];

  if (usuariosResponse.length !== 2) {
    throw CustomError.badRequest("Este usuario no existe");
  }
  let establecimientoData: establecimientoResponse | undefined = undefined;
  if (
    datosPaquete.idDestinoEstablecimiento !== undefined &&
    datosPaquete.idDestinoEstablecimiento !== null
  ) {
    [establecimientoData] = (await DB.Select([
      establecimientos.nombreEst,
      establecimientos.departamento,
      establecimientos.provincia,
      establecimientos.distrito,
    ])
      .from(establecimientos())
      .where(eq(establecimientos.idEst, datosPaquete.idDestinoEstablecimiento))
      .execute()) as establecimientoResponse[];
  }

  const [user1, user2] = usuariosResponse;

  return {
    paquete: {
      idpaquete: datosPaquete.idenvio,
      clave: datosPaquete.clave,
      montoPagado: datosPaquete.montocobrado,
      estadoPaquete: datosPaquete.estadopaquete,
      observacion: datosPaquete.observacion,
      destino: datosPaquete.destino,
      fechaCreado: datosPaquete.fechacreado,
    },
    usuarioOrigen: {
      nombre: user1.nombres,
      apellidoMaterno: user1.apellidomaterno,
      apellidoPaterno: user1.apellidopaterno,
      dni: user1.dniuser,
      correo: user1.correo,
      numero: user1.numero,
    },
    usuarioDestino: {
      nombre: user2.nombres,
      apellidoMaterno: user2.apellidomaterno,
      apellidoPaterno: user2.apellidopaterno,
      dni: user2.dniuser,
      correo: user2.correo,
      numero: user2.numero,
    },
    destinoEstablecimiento: {
      nombreEstablecimiento: establecimientoData?.nombreEst,
      departamento: establecimientoData?.departamento,
      distrito: establecimientoData?.distrito,
      provincia: establecimientoData?.provincia,
    },
  };
}
