import { createUsuarioValidator } from "../../validators/usuario/usuario.validator.js";

export class UsuarioDto {
  public nombre: string;
  public apellidopaterno: string;
  public apellidomaterno: string;
  public dni: string;
  public ruc?: string;
  public numero?: string;

  private constructor({
    nombre,
    apellidomaterno,
    apellidopaterno,
    dni,
    numero,
    ruc,
  }: UsuarioDto) {
    this.nombre = nombre;
    this.apellidomaterno = apellidomaterno;
    this.apellidopaterno = apellidopaterno;
    this.dni = dni;
    this.numero = numero;
    this.ruc = ruc;
  }

  static createUserDto(input: any): [string?, UsuarioDto?] {
    const validator = createUsuarioValidator(input);

    if (!validator.success) {
      return [validator.error.message, undefined];
    }

    return [undefined, new UsuarioDto(validator.data)];
  }
}
