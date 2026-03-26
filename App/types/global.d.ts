export type tipeUser = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

export type socketsResponses = "newUser" | "updateUser";

export type typeRol = "ADMIN" | "CHOFER" | "CLIENTE" | "COLABORADOR";

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
