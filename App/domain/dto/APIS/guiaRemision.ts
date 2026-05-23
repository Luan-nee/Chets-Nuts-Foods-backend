import {
  conductoresTypeClass,
  itemsTypes,
} from "../../use-cases/emisionGuia/guiaTypes.js";

export class GuiaRemisionDTO {
  public documento: "guia_remision_remitente" | "guia_remision_transportista";
  public serie: string;
  public numero: string;
  public fecha_de_emision: string;
  public hora_de_emision: string;
  public modalidad_de_transporte: "01" | "02";
  public motivo_de_traslado: "01" | "02" | "03" | "04" | "05" | "06" | "13";
  public fecha_inicio_de_traslado: string;

  public destinatario_tipo_de_documento: "01" | "06";
  public destinatario_numero_de_documento: string;
  public destinatario_denominacion: string; // en caso de ser ruc aqui nombre de la empresa , en caso de ser dni nombre

  public punto_de_partida_ubigeo: string;
  public punto_de_partida_direccion: string;

  public punto_de_llegada_ubigeo: string;
  public punto_de_llegada_direccion: string;

  public peso_bruto_unidad_de_medida: "KGM" | "NIU";
  public numero_de_bultos: number;
  public observaciones: string | null;

  public peso_bruto_total: number;

  public moneda?: "PEN";

  // TRANSPORTISTA
  public transportista?: {
    ruc: string;
    denominacion: string;
    numero_registro_MTC: string;
    numero_autorizacion?: string;
    codigo_entidad_autorizada: string;
  };

  //conductores
  public conductores: conductoresTypeClass[];

  // VEHICULO
  public vehiculos?: {
    vehiculo: string;
    numero_placa: string;
  }[];

  public items: itemsTypes[];

  constructor({
    documento,
    serie,
    numero,
    fecha_de_emision,
    hora_de_emision,
    peso_bruto_total,
    transportista,
    modalidad_de_transporte,
    motivo_de_traslado,
    fecha_inicio_de_traslado,
    destinatario_tipo_de_documento,
    destinatario_numero_de_documento,
    destinatario_denominacion,
    punto_de_partida_ubigeo,
    punto_de_partida_direccion,
    punto_de_llegada_ubigeo,
    punto_de_llegada_direccion,
    peso_bruto_unidad_de_medida,
    numero_de_bultos,
    moneda,
    conductores,
    vehiculos,
    items,
    observaciones,
  }: GuiaRemisionDTO) {
    this.documento = documento;
    this.serie = serie;
    this.numero = numero;
    this.fecha_de_emision = fecha_de_emision;
    this.hora_de_emision = hora_de_emision;
    this.peso_bruto_total = peso_bruto_total;
    this.transportista = transportista;
    this.conductores = conductores;
    this.observaciones = observaciones;
    this.modalidad_de_transporte = modalidad_de_transporte;
    this.motivo_de_traslado = motivo_de_traslado;
    this.fecha_inicio_de_traslado = fecha_inicio_de_traslado;
    this.destinatario_tipo_de_documento = destinatario_tipo_de_documento;
    this.destinatario_numero_de_documento = destinatario_numero_de_documento;
    this.destinatario_denominacion = destinatario_denominacion;
    this.punto_de_partida_ubigeo = punto_de_partida_ubigeo;
    this.punto_de_partida_direccion = punto_de_partida_direccion;
    this.punto_de_llegada_ubigeo = punto_de_llegada_ubigeo;
    this.punto_de_llegada_direccion = punto_de_llegada_direccion;
    this.peso_bruto_unidad_de_medida = peso_bruto_unidad_de_medida;
    this.numero_de_bultos = numero_de_bultos;
    this.moneda = moneda;
    this.vehiculos = vehiculos;
    this.items = items;
  }
}
