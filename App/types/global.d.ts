import { departamentosPeruType, UpdateParam } from "../consts.ts";

export type tipeUser = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

export type roomsSocket =
  | "ADMINS"
  | "CHOFERES"
  | "ESTABLECIMIENTO"
  | "CLIENTES"
  | "PAQUETES"
  | "SALIDATRANSPORTE";

export type estadoPaquete =
  | "ENTREGADO"
  | "CAMINO"
  | "DETENIDO"
  | "CANCELADO"
  | "REVISION"
  | "HOME";

export type estadoVehiculo = "OPERATIVO" | "INACTIVO" | "RESERVADO" | "OCUPADO";
export type accesoEstado = "DISPONIBLE" | "OCUPADO" | "OBSERVACION";
export type socketsResponses =
  | "newUser"
  | "updateUser"
  | "newVehiculo"
  | "upVehiculo"
  | "upEstablecimiento"
  | "newEstablecimiento"
  | "newSalidaTransporte"
  | "newProductDefect"
  | "updateProductDefect"
  | "updateSalidaTransporte"
  | "deleteSalidaTransporte"
  | "createpaquete"
  | "updatePaquete"
  | "notificacion";

export type typeRol = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

export type salidaTransType =
  | "INICIO"
  | "EN CAMINO"
  | "FINALIZADO"
  | "CANCELADO";

export type EstadosTipoEstablecimiento =
  | "fiscal"
  | "anexo"
  | "almacen"
  | "oficina"
  | "no_registrado";

export interface createAcces {
  password: string;
  tipos: typeRol;
  correo: string;
  nombre: string;
  apellidomaterno: string;
  apellidopaterno: string;
  dni: string;
  numero?: string;
  ruc?: string;
  edad: number;
  numeroLicenciaConducir?: string;
  sexo: "MASCULINO" | "FEMENINO";
  tipo?: "NATURAL" | "JURIDICO";
}

export interface updateAcceso {
  estado?: boolean;
  correo?: string;
  password?: string;
  tipos?: typeRol;
  idacceso: number;
}

export interface createEstablecimiento {
  idResponsable: number;
  nombreEstablecimiento: string;
  direccion: string;
  descripcion: string;
  latitud: string;
  longitud: string;
  distrito: string;
  provincia: string;
  departamento: departamentosPeruType;
  ubigeo: string;
  tipoEstado?: EstadosTipoEstablecimiento;
  codigoSunat?: string;
}

export interface updateEstablecimiento {
  idEstablecimiento: number;
  idResponsable?: number;
  nombreEstablecimiento?: string;
  direccion?: string;
  descripcion?: string;
  latitud?: string;
  longitud?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ubigeo?: string;
  tipoEstado?: EstadosTipoEstablecimiento | undefined;
  codigoSunat?: string;
  estadoVehiculo?: estadoVehiculo;
}

interface CreateCarro {
  anio: string;
  capacidadCarga: number;
  marca: string;
  modelo: string;
  placa: string;
  tipoVehiculo: string;
  vin?: string;
  numeroHabilitacion?: string;
}

interface UpdateCarro {
  idVehiculo: number;
  anio?: string;
  capacidadCarga?: string;
  marca?: string;
  modelo?: string;
  tipoVehiculo?: string;
  vin?: string;
  numeroHabilitacion?: string;
  estadoVehiculo?: boolean;
}

interface createSalidaTransporte {
  idVehiculo: number;
  idChoferAcceso: number;
  idOrigenEstablecimiento: number;
  idDestinoEstablecimiento: number;
  fechaSalida: Date;
}

export interface transporteType {
  idsalidatransporte: number;
  estadotransporte: boolean;
  fechasalida: Date;
  fechacreado: Date;
  fechafinalizado: Date;
  idvehiculo: number;
  idchoferacceso: number;
  idorigenestablecimiento: number;
  iddestinoestablecimiento: number;
}

export interface vehiculoType {
  placa: string;
  marca: string;
  modelo: string;
  capacidadCarga: number;
}

export interface choferType {
  idacceso: number;
  nombres: string;
  apellidomaterno: string;
  apellidopaterno: string;
  rucuser: string;
  numeroLicenciaConducir: string;
  edad: number;
  numero: string;
}

export interface establecimientoSelect {
  idEst: number;
  nombreEst: string;
  ubigeo: string;
  tipoestablecimiento: EstadosTipoEstablecimiento;
  departamento: string;
  codigoSunat: string;
  provincia: string;
  fechaCreacion: Date;
}

export interface salidaTransporteType {
  salidaTransporte: transporteType;
  vehiculo: vehiculoType;
  choferUser: choferType;
  origenEstablecimiento: establecimientoSelect;
  destinoEstablecimiento: establecimientoSelect;
  espacioDisponible?: number;
}

export interface createSalidaTransporte {
  fechaSalida: Date;
  idChoferAcceso: number;
  idOrigenEstablecimiento: number;
  idDestinoEstablecimiento: number;
  idVehiculo: number;
}

export interface updateCampos {
  tabla: string;
  condicional: string;
  setDatas: UpdateParam[];
}

export interface detallesSockets {
  contenido: string;
  socketGroup: roomsSocket[];
  socketEmitData: socketsResponses;
  update: boolean;
  querys: updateCampos[];
}

export interface ResponseSunat {
  success: boolean;
  message: string;
  payload?: {
    estado: "ACEPTADO" | "RECHAZADO" | "OBSERVADO";
    hash: string;
    xml: string;
    cdr: string;
    pdf: {
      a4: string;
    };
  };
}

export interface ResponseSunatDni {
  success: boolean;
  message: string;
  payload: {
    dni: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
  };
}

export type DataEmpresaTipo = "TEST" | "PROD";
/*
payload: {
    estado: "ACEPTADO";
    hash: "saX0yIBoQPZSHjaXBu7n6MhnD6WqGCnsLWSzv7zHgMS1=";
    xml: "https://sandbox.apisunat.pe/xml/527/5h4BwOEVRj/10752761278-09-T001-1";
    cdr: "https://sandbox.apisunat.pe/xml/527/5h4BwOEVRj/R-10752761278-09-T001-1";
    pdf: {
      a4: "https://sandbox.apisunat.pe/dispatch/pdf/a4/527/5h4BwOEVRj/10752761278-09-T001-1";
    };
  };*/
