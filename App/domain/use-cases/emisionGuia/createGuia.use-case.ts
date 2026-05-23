import { DB, eq, ORQ } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { GuiaRemisionDTO } from "../../dto/APIS/guiaRemision.js";
import {
  choferType,
  conductoresTypeClass,
  datosEmpresaType,
  establecimientoType,
  guiaremisionValidate,
  itemsTypes,
  paqueteValidate,
  productosPackageVal,
  productosTypes,
  userValores,
  usuariosData,
  vehiculoType,
} from "./guiaTypes.js";

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

  private async getsalidaTransporte(idsalida: number) {
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
      .execute()) as usuariosData[];

    return datos;
  }

  private async getchoferes(
    idchofer: number,
    idchofersecundario: number,
  ): Promise<{
    choferPrincipal: choferType;
    choferSecundario?: choferType;
  }> {
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
  ): Promise<{ userOrigen: userValores; userDestino: userValores }> {
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
  ): Promise<{
    establecimientoOrigen: establecimientoType;
    establecimientoDestino: establecimientoType;
  }> {
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

  private async getDatosEmpresa() {
    const { datosempresa } = generateTables();

    const [datos] = (await DB.Select([
      datosempresa.codigoMtc,
      datosempresa.correo,
      datosempresa.denominacion,
      datosempresa.numeroRegistroMtc,
      datosempresa.ruc,
    ])
      .from(datosempresa())
      .where(eq(datosempresa.idDatosEmpresa, 1))
      .execute(true)) as datosEmpresaType[];
    if (datos === undefined) {
      throw CustomError.badRequest("Por favor ingrese los datos de la empresa");
    }
    return datos;
  }

  private async getProductos(idpaquete: number) {
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
      (acumulador, producto) => acumulador + producto.pesototal,
      0,
    );

    const formatProducts: itemsTypes[] = responseProducts.map((producto) => {
      return {
        cantidad: producto.cantidad,
        codigo_interno: `P00${producto.id}`,
        descripcion: producto.nombreproducto,
        unidad_de_medida: "NIU",
      };
    });

    return {
      productos: formatProducts,
      cantidad: responseProducts.length,
      cantidadTotal: cantidad,
      pesoTotal: pesoTotal,
    };
  }

  private async getVehiculo(idVehiculo: number) {
    const { vehiculosempresa } = generateTables();

    const [vehiculo] = (await DB.Select([
      vehiculosempresa.idvehempresa,
      vehiculosempresa.placa,
    ])
      .from(vehiculosempresa())
      .where(eq(vehiculosempresa.idvehempresa, idVehiculo))
      .execute()) as vehiculoType[];

    return vehiculo;
  }

  private async generateGuiaRemision(paqueteData: paqueteValidate) {
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

    const dataEmpresa = await this.getDatosEmpresa();

    const vehiculo = await this.getVehiculo(salidatransporte.idvehiculo);

    const conductores: conductoresTypeClass[] = [
      {
        nombres: chofer.choferPrincipal.nombres,
        apellidos:
          chofer.choferPrincipal.apellidopaterno +
          " " +
          chofer.choferPrincipal.apellidomaterno,
        conductor: "principal",
        numero_de_documento: chofer.choferPrincipal.dniuser,
        tipo_de_documento: "1",
        numero_licencia_conducir: chofer.choferPrincipal.numeroLicenciaConducir,
      },
    ];

    if (chofer.choferSecundario !== undefined) {
      conductores.push({
        nombres: chofer.choferSecundario.nombres,
        apellidos:
          chofer.choferSecundario.apellidopaterno +
          " " +
          chofer.choferSecundario.apellidomaterno,
        conductor: "secundario",
        numero_de_documento: chofer.choferSecundario.dniuser,
        tipo_de_documento: "1",
        numero_licencia_conducir:
          chofer.choferSecundario.numeroLicenciaConducir,
      });
    }

    //motivo de traslado tiene que ser opcional para editarlo en la input
    //destinatario tipo de documento, 01 dni 06  ruc
    //si destinatario documento es ruc , se le pedira los datos de la empresa como tambien el ruc

    const datos: GuiaRemisionDTO = {
      documento: "guia_remision_remitente",
      motivo_de_traslado: "01",
      destinatario_tipo_de_documento: "01",
      destinatario_denominacion: usuarios.userDestino.nombres,
      destinatario_numero_de_documento: usuarios.userDestino.dniuser,
      fecha_de_emision: salidatransporte.fechacreado.toDateString(),
      hora_de_emision: salidatransporte.fechacreado.getHours().toString(),
      fecha_inicio_de_traslado: salidatransporte.fechasalida.toDateString(),
      numero: "1",
      modalidad_de_transporte: "01",
      numero_de_bultos: items.cantidadTotal,
      peso_bruto_unidad_de_medida: "NIU",
      peso_bruto_total: items.pesoTotal,
      punto_de_llegada_direccion:
        establecimiento.establecimientoDestino.direccion,
      punto_de_llegada_ubigeo: establecimiento.establecimientoDestino.ubigeo,
      punto_de_partida_direccion:
        establecimiento.establecimientoOrigen.direccion,
      punto_de_partida_ubigeo: establecimiento.establecimientoOrigen.ubigeo,
      serie: "T001",
      observaciones: "Servicio de traslado de productos",
      conductores,
      items: items.productos,
      transportista: {
        ruc: dataEmpresa.ruc,
        codigo_entidad_autorizada: dataEmpresa.codigoMtc,
        denominacion: dataEmpresa.denominacion,
        numero_registro_MTC: dataEmpresa.numeroRegistroMtc,
      },
      vehiculos: [
        {
          numero_placa: vehiculo.placa,
          vehiculo: "principal",
        },
      ],
    };
    return datos;
  }

  async execute(idpaquete: number) {
    const [error, responseValidate] = await this.validate(idpaquete);
    if (error !== undefined || responseValidate === undefined) {
      throw CustomError.badRequest(`Error : ${error}`);
    }

    const guia = await this.generateGuiaRemision(responseValidate);
    console.log(guia);
  }
}
