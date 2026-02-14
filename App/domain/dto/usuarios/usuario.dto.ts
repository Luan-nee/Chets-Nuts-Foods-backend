import {
  createUsuarioValidator,
  dniUsuarioValidator,
  rucUsuarioValidator,
} from "../../validators/usuario/usuario.validator.js";

export class UsuarioDto {
  public nombre: string;
  public apellidopaterno: string;
  public apellidomaterno: string;
  public dni?: string;
  public ruc?: string;
  public numero?: string;
  public tipo?: "NATURAL" | "JURIDICO";
  public edad?: number;

  private constructor({
    nombre,
    apellidomaterno,
    apellidopaterno,
    dni,
    numero,
    ruc,
    edad,
  }: UsuarioDto) {
    this.nombre = nombre;
    this.apellidomaterno = apellidomaterno;
    this.apellidopaterno = apellidopaterno;
    this.dni = dni;
    this.numero = numero;
    this.ruc = ruc;
    this.edad = edad;
  }

  static createUserDto(input: any): [string?, UsuarioDto?] {
    const validator = createUsuarioValidator(input);

    if (!validator.success) {
      return [validator.error.message, undefined];
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
