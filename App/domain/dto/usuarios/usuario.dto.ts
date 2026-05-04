import { ZodIssue } from "zod/v3";
import {
  createUsuarioValidator,
  dniUsuarioValidator,
  rucUsuarioValidator,
} from "../../validators/usuario/usuario.validator.js";

type Result =
  | { error: ZodIssue[]; data?: undefined }
  | { error?: undefined; data: UsuarioDto };

export class UsuarioDto {
  public nombre: string;
  public apellidopaterno: string;
  public apellidomaterno: string;
  public dni: string;
  public edad: number;
  public ruc?: string;
  public numero?: string;
  public tipo?: "NATURAL" | "JURIDICO" | undefined;
  public numeroLicenciaConducir?: string;
  public correo?: string;
  public sexo: "MASCULINO" | "FEMENINO";

  private constructor({
    nombre,
    apellidomaterno,
    apellidopaterno,
    dni,
    numero,
    ruc,
    edad,
    numeroLicenciaConducir,
    sexo,
    correo,
    tipo,
  }: UsuarioDto) {
    this.nombre = nombre;
    this.apellidomaterno = apellidomaterno;
    this.apellidopaterno = apellidopaterno;
    this.dni = dni;
    this.numero = numero;
    this.ruc = ruc;
    this.edad = edad;
    this.numeroLicenciaConducir = numeroLicenciaConducir;
    this.sexo = sexo;
    this.correo = correo;
    this.tipo = tipo;
  }

  static createUserDto(input: any): [string?, UsuarioDto?] {
    const validator = createUsuarioValidator(input);
    if (!validator.success) {
      const errorres = validator.error.issues.map((err) => err.message);
      return [JSON.stringify(errorres), undefined];
    }

    return [undefined, new UsuarioDto(validator.data)];
  }

  static validDniUserDto(input: any): [string?, string?] {
    const validator = dniUsuarioValidator(input);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, validator.data.dni];
  }

  static validRucUserDto(input: any): [string?, string?] {
    const validator = rucUsuarioValidator(input);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, validator.data.ruc];
  }
}
