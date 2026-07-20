import { DB, eq, ORD, ORQD } from "zormz";
import { generateTables } from "../../BD-Control.js";
import { estadoPaquete, salidaTransType } from "../../types/global.js";
import { CustomError } from "../../core/res/Custom.error.js";
import {
  establecimientoType,
  productosClientType,
  typePackage,
  usuarioType,
} from "./clientTypes.js";

export class ClientUseCase {
  private async getusuarios(ids: number[]) {
    const { usuarios } = generateTables();
    const usuariosData = (await DB.Select([
      usuarios.iduser,
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.dniuser,
      usuarios.rucuser,
      usuarios.numero,
    ])
      .from(usuarios())
      .where(ORQD(usuarios.iduser, ids))
      .execute()) as usuarioType[];

    if (usuariosData.length === 0 || usuariosData.length > 3) {
      throw CustomError.badRequest("No existe estos usuarios");
    }

    return usuariosData;
  }

  private async getChofer(id: number) {
    const { accesos, usuarios } = generateTables();

    const [choferData] = (await DB.Select([
      accesos.correo,
      usuarios.iduser,
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.dniuser,
      usuarios.rucuser,
    ])
      .from(accesos())
      .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser, false))
      .where(eq(accesos.idacceso, id))
      .execute()) as usuarioType[];

    return choferData;
  }

  private async getEstablecimientos(idEstablecimientos: number) {
    const { establecimientos } = generateTables();

    const establecimientoData = (await DB.Select([
      establecimientos.nombreEst,
      establecimientos.codigoSunat,
      establecimientos.ubigeo,
      establecimientos.departamento,
      establecimientos.provincia,
      establecimientos.distrito,
    ])
      .from(establecimientos())
      .where(eq(establecimientos.idEst, idEstablecimientos))
      .execute()) as establecimientoType[];

    if (establecimientoData.length === 0 || establecimientoData.length >= 3) {
      throw CustomError.badRequest("Ocurrio un error al realizar la consulta");
    }

    return establecimientoData;
  }

  async getpackage(idpaquete: number) {
    const { paquetes, salidatransporte } = generateTables();

    const [dataPackage] = (await DB.Select([
      paquetes.destino,
      paquetes.idDestinoEstablecimiento,
      paquetes.estadopaquete,
      paquetes.cantidadproduct,
      paquetes.idsalidatransporte,
      paquetes.idusuario,
      paquetes.idusuarioDestino,
      paquetes.montocobrado,
      paquetes.observacion,
      salidatransporte.idorigenestablecimiento,
      salidatransporte.estadotransporte,
      salidatransporte.idchoferacceso,
      salidatransporte.fechasalida,
      paquetes.ultimaactualizacion,
      paquetes.fechacreado,
    ])
      .from(paquetes())
      .innerJOIN(
        salidatransporte(),
        eq(
          paquetes.idsalidatransporte,
          salidatransporte.idsalidatransporte,
          false,
        ),
      )
      .where(eq(paquetes.idenvio, idpaquete))
      .execute()) as typePackage[];

    const [usuario, recepUser] = await this.getusuarios([
      dataPackage.idusuario,
      dataPackage.idusuarioDestino,
    ]);

    const chofer = await this.getChofer(dataPackage.idchoferacceso);

    const [establecimientoOrigen] = await this.getEstablecimientos(
      dataPackage.idorigenestablecimiento,
    );

    let establecimientoDestino = undefined;

    if (dataPackage.idDestinoEstablecimiento !== null) {
      [establecimientoDestino] = await this.getEstablecimientos(
        dataPackage.idDestinoEstablecimiento,
      );
    }

    return {
      establecimientoOrigen,
      establecimientoDestino,
      usuarioOrigen: usuario,
      usuarioReceptor: recepUser,
      chofer,
      destino: dataPackage.destino,
      estadoPaquete: dataPackage.estadopaquete,
      fechaSalida: dataPackage.fechasalida,
      ultimaActualizacion: dataPackage.ultimaactualizacion,
      estadoTransporte: dataPackage.estadotransporte,
      montoCobrado: dataPackage.montocobrado,
      cantidadProductos: dataPackage.cantidadproduct,
      observacion: dataPackage.observacion,
    };
  }

  async getProductos(idpaquete: number) {
    const { productos } = generateTables();

    const producto = (await DB.Select([
      productos.nombreproducto,
      productos.pesounitario,
      productos.cantidad,
      productos.pesototal,
      productos.observacion,
      productos.fechacreacion,
    ])
      .from(productos())
      .where(eq(productos.idenvio, idpaquete))
      .execute()) as productosClientType[];

    return producto;
  }

  async getSeguimientoProducts(idpaquete: number) {
    const { seguimientopaquetes, paquetes } = generateTables();

    const paqueteSeg = await DB.Select([
      seguimientopaquetes.latitud,
      seguimientopaquetes.longitud,
      seguimientopaquetes.direccion,
      seguimientopaquetes.titulo,
      seguimientopaquetes.comentario,
      seguimientopaquetes.fecharegistro,
      seguimientopaquetes.idseg,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idpaquete))
      .execute();

    return paqueteSeg;
  }
}
