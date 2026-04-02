import { departamentosPeruType } from "../consts.ts";

export type tipeUser = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

export type roomsSocket =
  | "ADMINS"
  | "CHOFERES"
  | "ESTABLECIMIENTO"
  | "CLIENTES";

export type socketsResponses =
  | "newUser"
  | "updateUser"
  | "newVehiculo"
  | "upVehiculo"
  | "upEstablecimiento"
  | "newEstablecimiento";

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
  activo?: boolean;
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
  estado?: boolean;
}

interface createSalidaTransporte {
  idVehiculo: number;
  idChoferAcceso: number;
  idOrigenEstablecimiento: number;
  idDestinoEstablecimiento: number;
  fechaSalida: Date;
  estadoTransporte: salidaTransType;
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
}
