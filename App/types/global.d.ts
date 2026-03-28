import { departamentosPeruType } from "../consts.ts";

export type tipeUser = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

export type socketsResponses = "newUser" | "updateUser";

export type typeRol = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

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
