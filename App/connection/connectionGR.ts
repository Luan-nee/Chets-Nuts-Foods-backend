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
import { ResponseSunat } from "../types/global.js";
import { GuiaRemisionDTO } from "../domain/dto/APIS/guiaRemision.js";
import { CreateGuiaRemisionDto } from "../domain/dto/guiaRemision/createGuiaRemisionDto.js";

interface getDatosGR {
  usuarios: setUsersGui;
  salidaTransporte: setSalidaTransporteGui;
  choferes: setChoferesGui;
  establecimientos: setEstablecimientoGUI;
  items: setItems;
  dataEmpresa: datosEmpresaType;
  vehiculo: vehiculoTypeGR;
  dtoGuia: CreateGuiaRemisionDto;
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

  static async fastConsulta({
    usuarios,
    choferes,
    dataEmpresa,
    establecimientos,
    items,
    salidaTransporte,
    vehiculo,
    dtoGuia,
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
      numero: "1",
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
      serie: "T003",
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
    console.log(datos);
    const response = await this.consulta(dataEmpresa, datos);
    return { response, datos };
  }
}
