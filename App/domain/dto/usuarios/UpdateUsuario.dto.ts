import { updateUsuarioValidator } from "../../validators/usuario/usuario.validator.js";

export class UpdateUsuarioDto {
  public iduser: number;
  public nombre?: string;
  public apellidopaterno?: string;
  public apellidomaterno?: string;
  public ruc?: string;
  public numero?: string;
  public edad?: string;

  private constructor({
    iduser,
    nombre,
    apellidomaterno,
    apellidopaterno,
    ruc,
    numero,
    edad,
  }: UpdateUsuarioDto) {
    this.iduser = iduser;
    this.nombre = nombre;
    this.apellidomaterno = apellidomaterno;
    this.apellidopaterno = apellidopaterno;
    this.ruc = ruc;
    this.numero = numero;
    this.edad = edad;
  }

  static createUpdateUser(input: any): [string?, UpdateUsuarioDto?] {
    const validator = updateUsuarioValidator(input);

    if (!validator.success) {
      return [validator.error.message, undefined];
    }

    return [undefined, new UpdateUsuarioDto(validator.data)];
  }
}
