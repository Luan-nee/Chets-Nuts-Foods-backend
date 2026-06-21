export interface guiaremisionValidate {
  confirmado: boolean;
  idguia: number;
  idpaquete: number;
}

export interface paqueteValidate {
  idenvio: number;
  estadopaquete: estadoPaquete;
  idusuario: number;
  idusuarioDestino: number;
  idDestinoEstablecimiento: number;
  destino: string;
  idsalidatransporte: number;
}

export interface productosPackageVal {
  nombreproducto: string;
  pesounitario: number;
  cantidad: number;
  pesototal: number;
}

export interface userValores {
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  dniuser: string;
  rucuser: string;
  numero: string;
  correo: string;
}

export interface usuariosData {
  idchoferacceso: number;
  idchoferaccesosecundario: number;
  idvehiculo: number;
  idorigenestablecimiento: number;
  iddestinoestablecimiento: number;
  fechacreado: Date;
  fechasalida: Date;
}

export interface choferType {
  idusuario: number;
  apellidomaterno: string;
  apellidopaterno: string;
  nombres: string;
  dniuser: string;
  numeroLicenciaConducir: string;
  numero: string;
  rucuser: string;
}

export interface establecimientoType {
  codigoSunat: string;
  ubigeo: string;
  direccion: string;
  latitud: string;
  longitud: string;
  departamento: string;
}

export interface datosEmpresaType {
  codigoMtc: string;
  correo: string;
  denominacion: string;
  numeroRegistroMtc: string;
  ruc: string;
  claveAcceso: string;
  urlApi: string;
  tipo: string;
}

export interface productosTypes {
  nombreproducto: string;
  cantidad: number;
  id: number;
  observacion: string;
  pesototal: number;
  pesounitario: number;
}

export interface itemsTypes {
  codigo_interno: string;
  descripcion: string;
  unidad_de_medida: "NIU" | "KGM";
  cantidad: number;
}

export interface vehiculoTypeGR {
  idvehempresa: number;
  placa: string;
}

export interface conductoresTypeClass {
  conductor: string;
  tipo_de_documento: "1" | "6";
  numero_de_documento: string;
  nombres: string;
  apellidos: string;
  numero_licencia_conducir: string;
}

export interface setUsersGui {
  userOrigen: userValores;
  userDestino: userValores;
}

export interface setSalidaTransporteGui {
  idchoferacceso: number;
  idchoferaccesosecundario: number;
  idvehiculo: number;
  idorigenestablecimiento: number;
  iddestinoestablecimiento: number;
  fechacreado: Date;
  fechasalida: Date;
}

export interface setChoferesGui {
  choferPrincipal: choferType;
  choferSecundario?: choferType;
}

export interface setEstablecimientoGUI {
  establecimientoOrigen: establecimientoType;
  establecimientoDestino: establecimientoType;
}

export interface setItems {
  productos: itemsTypes[];
  cantidad: number;
  cantidadTotal: number;
  pesoTotal: number;
}
