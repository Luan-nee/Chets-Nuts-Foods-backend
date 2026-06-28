import { DB, eq, MIN, ORQ } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import {
  choferType,
  datosEmpresaType,
  establecimientoType,
  guiaremisionValidate,
  itemsTypes,
  paqueteValidate,
  productosTypes,
  setChoferesGui,
  setEstablecimientoGUI,
  setItems,
  setSalidaTransporteGui,
  setUsersGui,
  vehiculoTypeGR,
} from "./guiaTypes.js";
import { CreateGuiaRemisionDto } from "../../dto/guiaRemision/createGuiaRemisionDto.js";
import ConnectionGR from "../../../connection/connectionGR.js";

export class CreateGuiaUseCase {
  async validatePaquete(
    idPaquete: number,
  ): Promise<[string?, paqueteValidate?]> {
    const { paquetes } = generateTables();

    const paqueteData = (await DB.Select([
      paquetes.idenvio,
      paquetes.estadopaquete,
      paquetes.idusuario,
      paquetes.idusuarioDestino,
      paquetes.idDestinoEstablecimiento,
      paquetes.destino,
      paquetes.idsalidatransporte,
    ])
      .from(paquetes())
      .where(eq(paquetes.idenvio, idPaquete))
      .execute()) as paqueteValidate[];

    if (paqueteData.length === 0) {
      return ["El paquete no existe", undefined];
    }
    return [undefined, paqueteData[0]];
  }

  async validate(idpaquete: number): Promise<[string?, paqueteValidate?]> {
    const { guiasremision } = generateTables();

    const guiavalidate = (await DB.Select([
      guiasremision.confirmado,
      guiasremision.idguia,
      guiasremision.idpaquete,
    ])
      .from(guiasremision())
      .where(eq(guiasremision.idpaquete, idpaquete))
      .execute()) as guiaremisionValidate[];

    if (guiavalidate.length !== 0) {
      return [
        "El paquete ya tiene una guia de remision generada no se puede duplicar",
        undefined,
      ];
    }

    const [error, responseValidate] = await this.validatePaquete(idpaquete);

    if (error !== undefined || responseValidate === undefined) {
      return [error, undefined];
    }

    return [undefined, responseValidate];
  }

  private async getsalidaTransporte(
    idsalida: number,
  ): Promise<setSalidaTransporteGui> {
    const { salidatransporte } = generateTables();
    const [datos] = (await DB.Select([
      salidatransporte.idchoferacceso,
      salidatransporte.idchoferaccesosecundario,
      salidatransporte.idvehiculo,
      salidatransporte.idorigenestablecimiento,
      salidatransporte.iddestinoestablecimiento,
      salidatransporte.fechacreado,
      salidatransporte.fechasalida,
    ])
      .from(salidatransporte())
      .where(eq(salidatransporte.idsalidatransporte, idsalida))
      .execute()) as setSalidaTransporteGui[];

    return datos;
  }

  private async getchoferes(
    idchofer: number,
    idchofersecundario: number,
  ): Promise<setChoferesGui> {
    const { accesos, usuarios } = generateTables();

    console.log(idchofer);
    console.log(idchofersecundario);

    const choferes = (await DB.Select([
      accesos.idusuario,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.nombres,
      usuarios.dniuser,
      usuarios.numeroLicenciaConducir,
      usuarios.numero,
      usuarios.rucuser,
    ])
      .from(accesos())
      .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser, false))
      .where(ORQ(accesos.idacceso, idchofer, idchofersecundario))
      .execute()) as choferType[];

    const choferesResponse = {
      choferPrincipal: choferes[0],
      choferSecundario: choferes[1],
    };

    return choferesResponse;
  }

  private async getUsuariosPackage(
    idUserOrigen: number,
    idUserDestino: number,
  ): Promise<setUsersGui> {
    const { usuarios } = generateTables();

    const usuariosPackage = await DB.Select([
      usuarios.nombres,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.rucuser,
      usuarios.numero,
      usuarios.correo,
    ])
      .from(usuarios())
      .where(ORQ(usuarios.iduser, idUserOrigen, idUserDestino))
      .execute();

    const valores = {
      userOrigen: { ...usuariosPackage[0] },
      userDestino: { ...usuariosPackage[1] },
    };

    return valores;
  }

  private async getEstablecimiento(
    idorigen: number,
    idDestino: number,
  ): Promise<setEstablecimientoGUI> {
    const { establecimientos } = generateTables();

    const datosEstablecimiento = (await DB.Select([
      establecimientos.codigoSunat,
      establecimientos.ubigeo,
      establecimientos.direccion,
      establecimientos.latitud,
      establecimientos.longitud,
      establecimientos.departamento,
    ])
      .from(establecimientos())
      .where(ORQ(establecimientos.idEst, idorigen, idDestino))
      .execute()) as establecimientoType[];

    const establecimientosData = {
      establecimientoOrigen: datosEstablecimiento[0],
      establecimientoDestino: datosEstablecimiento[1],
    };
    return establecimientosData;
  }

  private async getDatosEmpresa(
    idDatoEmpresa?: number,
  ): Promise<datosEmpresaType> {
    const { datosempresa } = generateTables();

    const datosQuery = [
      datosempresa.codigoMtc,
      datosempresa.correo,
      datosempresa.denominacion,
      datosempresa.numeroRegistroMtc,
      datosempresa.ruc,
      datosempresa.claveAcceso,
      datosempresa.urlApi,
      datosempresa.tipoestadoempresa,
    ];

    const datos = DB.Select(datosQuery).from(datosempresa());

    if (idDatoEmpresa !== undefined) {
      datos.where(eq(datosempresa.idDatosEmpresa, idDatoEmpresa));
    }

    const [response] = (await datos
      .OrderBy({ idDatosEmpresa: "ASC" })
      .LIMIT(1)
      .execute(true)) as datosEmpresaType[];

    if (response === undefined) {
      throw CustomError.badRequest("Por favor ingrese los datos de la empresa");
    }

    return response;
  }

  private async getProductos(idpaquete: number): Promise<setItems> {
    const { productos } = generateTables();

    const responseProducts = (await DB.Select([
      productos.nombreproducto,
      productos.cantidad,
      productos.id,
      productos.observacion,
      productos.pesototal,
      productos.pesounitario,
    ])
      .from(productos())
      .where(eq(productos.idenvio, idpaquete))
      .execute()) as productosTypes[];

    const cantidad = responseProducts.reduce(
      (acumulador, producto) => acumulador + producto.cantidad,
      0,
    );

    const pesoTotal = responseProducts.reduce(
      (acumulador, producto) => acumulador + Number(producto.pesototal),
      0,
    );

    const formatProducts: itemsTypes[] = responseProducts.map((producto) => {
      return {
        cantidad: producto.cantidad,
        codigo_interno: `P00${producto.id}`,
        descripcion: producto.nombreproducto,
        unidad_de_medida: "KGM",
      };
    });

    return {
      productos: formatProducts,
      cantidad: responseProducts.length,
      cantidadTotal: cantidad,
      pesoTotal: pesoTotal,
    };
  }

  private async getVehiculo(idVehiculo: number): Promise<vehiculoTypeGR> {
    const { vehiculosempresa } = generateTables();

    const [vehiculo] = (await DB.Select([
      vehiculosempresa.idvehempresa,
      vehiculosempresa.placa,
    ])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo))
      .execute()) as vehiculoTypeGR[];

    return vehiculo;
  }

  private async generateGuiaRemision(
    paqueteData: paqueteValidate,
    dtoGuia: CreateGuiaRemisionDto,
    idpaquete: number,
    numeroTransporte?: number,
  ) {
    const { guiasremision } = generateTables();

    const usuarios = await this.getUsuariosPackage(
      paqueteData.idusuario,
      paqueteData.idusuarioDestino,
    );

    const salidatransporte = await this.getsalidaTransporte(
      paqueteData.idsalidatransporte,
    );
    const chofer = await this.getchoferes(
      salidatransporte.idchoferacceso,
      salidatransporte.idchoferaccesosecundario,
    );

    const establecimiento = await this.getEstablecimiento(
      salidatransporte.idorigenestablecimiento,
      salidatransporte.iddestinoestablecimiento,
    );

    const items = await this.getProductos(paqueteData.idenvio);

    const dataEmpresa = await this.getDatosEmpresa(dtoGuia.idDataEmpresa);

    const vehiculo = await this.getVehiculo(salidatransporte.idvehiculo);
    //motivo de traslado tiene que ser opcional para editarlo en la input
    //destinatario tipo de documento, 01 dni 06  ruc
    //si destinatario documento es ruc , se le pedira los datos de la empresa como tambien el ruc
    const response = await ConnectionGR.fastConsulta({
      usuarios,
      choferes: chofer,
      dataEmpresa,
      dtoGuia,
      establecimientos: establecimiento,
      items,
      salidaTransporte: salidatransporte,
      vehiculo: vehiculo,
      numeroGuia: numeroTransporte,
    });

    if (!response.response.success || !response.response.payload) {
      throw CustomError.badRequest(response.response.message);
    }

    const ultimo = response.response.payload.xml.split("/").pop();

    if (ultimo === undefined) {
      throw CustomError.badRequest(response.response.message);
    }
    const idGuia = await DB.Insert(guiasremision(), [
      guiasremision.idpaquete,
      guiasremision.tipogeneration,
      guiasremision.numero,
      guiasremision.qrUrl,
      guiasremision.confirmado,
      guiasremision.datagenerate,
      guiasremision.hash,
      guiasremision.estadoguia,
    ])
      .Values([
        idpaquete,
        dataEmpresa.tipo,
        ultimo,
        response.response.payload.pdf.a4,
        true,
        JSON.stringify(response.datos),
        response.response.payload.hash,
        response.response.payload.estado,
      ])
      .Returning(guiasremision.idguia)
      .execute();

    console.log(idGuia);

    return {
      idGuia,
      pdf: response.response.payload?.pdf.a4, //"https://sandbox.apisunat.pe/dispatch/pdf/a4/537/MHBjPXqK7Q/10752761278-09-T002-1",
    };
  }

  async execute(idpaquete: number, dtoGuia: CreateGuiaRemisionDto) {
    const [error, responseValidate] = await this.validate(idpaquete);
    if (error !== undefined || responseValidate === undefined) {
      throw CustomError.badRequest(`Error : ${error}`);
    }

    const guia = await this.generateGuiaRemision(
      responseValidate,
      dtoGuia,
      idpaquete,
      dtoGuia.codigoTransporte,
    );
    return guia;
  }
}
