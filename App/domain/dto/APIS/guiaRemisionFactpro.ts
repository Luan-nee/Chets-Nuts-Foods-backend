export class GuiaRemisionFactproDTO {
  public tipo_documento = "09";
  public "serie": string; // el inicio obligatorio una T
  public "numero": string;
  public "fecha_de_traslado": string;
  public "codigo_modo_transporte": "01" | "02";
  public "motivo_traslado": "01" | "02" | "03" | "04" | "05" | "06" | "07";
  public peso_bruto_unidad = "KGM";
  public "peso_bruto_total": string;
  public "numero_de_bultos": number;
  public "cliente": {
    cliente_tipo_documento: "4" | "2";
    cliente_numero_documento: string;
    cliente_denominacion: string;
    codigo_pais: "PE";
    ubigeo?: string;
    cliente_direccion: string;
    cliente_email?: string;
    cliente_telefono: string;
  };
  public transportista: {
    numero_registro_mtc: string;
  };
  public conductor: {
    conductor_tipo_documento: "1";
    conductor_numero_documento: string;
    conductor_nombres_y_apellidos: string;
    conductor_numero_licencia: string;
    conductor_numero_de_placa: string;
  };
  public direccion_partida: {
    ubigeo: string;
    direccion: string;
  };
  public direccion_llegada: {
    ubigeo: string;
    direccion: string;
  };
  public observaciones?: string;
  public numero_de_contenedor = "";
  public formato_pdf = "a4";
  public items: {
    codigo: string;
    cantidad: string;
    descripcion: string;
    unidad: "NIU";
  }[];
  public envio_indicador: "";

  constructor({
    cliente,
    codigo_modo_transporte,
    conductor,
    direccion_llegada,
    direccion_partida,
    envio_indicador,
    fecha_de_traslado,
    items,
    motivo_traslado,
    numero,
    numero_de_bultos,
    numero_de_contenedor,
    peso_bruto_total,
    peso_bruto_unidad,
    serie,
    tipo_documento,
    transportista,
    observaciones,
  }: GuiaRemisionFactproDTO) {
    this.cliente = cliente;
    this.codigo_modo_transporte = codigo_modo_transporte;
    this.conductor = conductor;
    this.direccion_llegada = direccion_llegada;
    this.direccion_partida = direccion_partida;
    this.envio_indicador = envio_indicador;
    this.fecha_de_traslado = fecha_de_traslado;
    this.items = items;
    this.motivo_traslado = motivo_traslado;
    this.numero = numero;
    this.numero_de_bultos = numero_de_bultos;
    this.numero_de_contenedor = numero_de_contenedor;
    this.peso_bruto_total = peso_bruto_total;
    this.peso_bruto_unidad = peso_bruto_unidad;
    this.serie = serie;
    this.tipo_documento = tipo_documento;
    this.transportista = transportista;
    this.observaciones = observaciones;
  }
}
