import { COUNT, DB, eq, ORQ, SUM } from "zormz";
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
  const { paquetes, usuarios, establecimientos, productos } = generateTables();

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

  const [logist] = (await DB.Select([
    SUM(productos.pesototal, "pesoTotal"),
    COUNT(productos.id, "cantidad"),
  ])
    .from(productos())
    .where(eq(productos.idenvio, idPaquete))
    .execute()) as { pesoTotal: number; cantidad: number }[];

  const camposUsers = [
    usuarios.nombres,
    usuarios.apellidomaterno,
    usuarios.apellidopaterno,
    usuarios.dniuser,
    usuarios.numero,
    usuarios.correo,
  ];

  const [user1] = (await DB.Select(camposUsers)
    .from(usuarios())
    .where(eq(usuarios.iduser, datosPaquete.idusuario))
    .execute()) as usuariosResponse[];

  const [user2] = (await DB.Select(camposUsers)
    .from(usuarios())
    .where(eq(usuarios.iduser, datosPaquete.idusuarioDestino))
    .execute()) as usuariosResponse[];

  if (!user1) {
    throw CustomError.badRequest("El usuario emisor no existe");
  }

  if (!user2) {
    throw CustomError.badRequest("El usuario receptor no existe");
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

  return {
    pesoTotalProductos: Number(logist.pesoTotal),
    totalProductos: logist.cantidad,
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
