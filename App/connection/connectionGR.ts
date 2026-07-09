import {
  conductoresTypeClass,
  datosEmpresaType,
  setChoferesGui,
  setEstablecimientoGUI,
  setItems,
  setSalidaTransporteGui,
  setUsersGui,
  vehiculoTypeGR,
} from "../domain/use-cases/emisionGuia/guiaTypes.js";
import { ResponseSunat, ResponseSunatDni } from "../types/global.js";
import { GuiaRemisionDTO } from "../domain/dto/APIS/guiaRemision.js";
import { CreateGuiaRemisionDto } from "../domain/dto/guiaRemision/createGuiaRemisionDto.js";
import { envs } from "../core/config/envs.js";

interface getDatosGR {
  usuarios: setUsersGui;
  salidaTransporte: setSalidaTransporteGui;
  choferes: setChoferesGui;
  establecimientos: setEstablecimientoGUI;
  items: setItems;
  dataEmpresa: datosEmpresaType;
  vehiculo: vehiculoTypeGR;
  dtoGuia: CreateGuiaRemisionDto;
  idpaquete: number;
  numeroGuia?: number;
}

export default class ConnectionGR {
  private static async consulta(
    datoEmpresa: datosEmpresaType,
    datos: GuiaRemisionDTO,
  ): Promise<ResponseSunat> {
    const data = await fetch(datoEmpresa.urlApi, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${datoEmpresa.claveAcceso}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    const response = (await data.json()) as ResponseSunat;
    return response;
  }
  /*

{
  success: true,
  message: 'Datos procesados correctamente',
  payload: {
    dni: '75276126',
    nombres: 'JHOMAR NOE',
    apellido_paterno: 'PAMPA',
    apellido_materno: 'CAPQUEQUI'
  }
}
 */
  static async getRuc(ruc: string, datoEmpresa: datosEmpresaType) {
    const { APISUNAT } = envs;
    const data = await fetch(`${APISUNAT}/api/v1/business/ruc/${ruc}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${datoEmpresa.claveAcceso}`,
        "Content-Type": "application/json",
      },
    });
    const response = (await data.json()) as ResponseSunatDni;
    return response;
  }

  static async getdni(dni: string, datoEmpresa: datosEmpresaType) {
    const { APISUNAT } = envs;
    const ruta = `${APISUNAT}/api/v1/person/dni/${dni}`;
    console.log(ruta);
    const data = await fetch(ruta, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${datoEmpresa.claveAcceso}`,
        "Content-Type": "application/json",
      },
    });
    const response = (await data.json()) as ResponseSunatDni;
    return response;
  }

  /*
 (GET) /api/v1/person/dni/{DNI}
 (GET) /api/v1/business/ruc/{RUC}
*/

  static async fastConsulta({
    usuarios,
    choferes,
    dataEmpresa,
    establecimientos,
    items,
    salidaTransporte,
    vehiculo,
    dtoGuia,
    numeroGuia,
    idpaquete,
  }: getDatosGR) {
    const conductores: conductoresTypeClass[] = [
      {
        nombres: choferes.choferPrincipal.nombres,
        apellidos:
          choferes.choferPrincipal.apellidopaterno +
          " " +
          choferes.choferPrincipal.apellidomaterno,
        conductor: "principal",
        numero_de_documento: choferes.choferPrincipal.dniuser,
        tipo_de_documento: "1",
        numero_licencia_conducir:
          choferes.choferPrincipal.numeroLicenciaConducir,
      },
    ];

    if (choferes.choferSecundario !== undefined) {
      conductores.push({
        nombres: choferes.choferSecundario.nombres,
        apellidos:
          choferes.choferSecundario.apellidopaterno +
          " " +
          choferes.choferSecundario.apellidomaterno,
        conductor: "secundario",
        numero_de_documento: choferes.choferSecundario.dniuser,
        tipo_de_documento: "1",
        numero_licencia_conducir:
          choferes.choferSecundario.numeroLicenciaConducir,
      });
    }

    const fechaHpy = new Date();
    fechaHpy.setHours(fechaHpy.getHours() - 5);

    const horaEmision = String(
      salidaTransporte.fechacreado.getHours(),
    ).padStart(2, "0");

    const minutosEmision = String(
      salidaTransporte.fechacreado.getMinutes(),
    ).padStart(2, "0");

    const segundosEmision = String(
      salidaTransporte.fechacreado.getSeconds(),
    ).padStart(2, "0");

    const numeroGuiaD = numeroGuia === undefined ? "T001" : `T00${numeroGuia}`;

    const datos: GuiaRemisionDTO = {
      documento: "guia_remision_remitente",
      motivo_de_traslado: dtoGuia.motivoTraslado || "01",
      destinatario_tipo_de_documento:
        dtoGuia.docDestinatario === "DNI" ||
        dtoGuia.docDestinatario === undefined
          ? "01"
          : "06",
      destinatario_denominacion: usuarios.userDestino.nombres,
      destinatario_numero_de_documento: usuarios.userDestino.dniuser,
      fecha_de_emision: fechaHpy.toISOString().split("T")[0],
      hora_de_emision: `${horaEmision}:${minutosEmision}:${segundosEmision}`,
      fecha_inicio_de_traslado: salidaTransporte.fechasalida
        .toISOString()
        .split("T")[0],
      numero: idpaquete.toString(),
      fecha_entrega_transportista: salidaTransporte.fechacreado
        .toISOString()
        .split("T")[0],
      fecha_entrega_a_transportista: salidaTransporte.fechacreado
        .toISOString()
        .split("T")[0],
      modalidad_de_transporte: dtoGuia.modalidadTransporte || "02",
      numero_de_bultos: items.cantidadTotal,
      peso_bruto_unidad_de_medida: "KGM",
      peso_bruto_total: items.pesoTotal,
      punto_de_llegada_direccion:
        establecimientos.establecimientoDestino.direccion,
      punto_de_llegada_ubigeo: establecimientos.establecimientoDestino.ubigeo,
      punto_de_partida_direccion:
        establecimientos.establecimientoOrigen.direccion,
      punto_de_partida_ubigeo: establecimientos.establecimientoOrigen.ubigeo,
      serie: numeroGuiaD,
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
          numero_de_placa: vehiculo.placa,
          vehiculo: "principal",
        },
      ],
    };
    //console.log(datos);
    const response = await this.consulta(dataEmpresa, datos);
    /*
    const response = {
      response: {
        success: true,
        payload: {
          xml: "",
          pdf: { a4: "" },
          hash: "ssssss",
          estado: "ACEPTADO",
        },
        message: "",
      },
    };*/
    return { response, datos };
  }
}
