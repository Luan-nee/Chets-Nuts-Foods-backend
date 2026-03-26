import { typeRol } from "../../../types/global.js";
import { updateAccesoValidator } from "../../validators/acceso/acceso.validator.js";

export class UpdateAccesDto {
  public idacceso: number;
  public password?: string;
  public correo?: string;
  public estado?: boolean;
  public tipos?: typeRol;

  private constructor({
    estado,
    correo,
    password,
    tipos,
    idacceso,
  }: UpdateAccesDto) {
    this.idacceso = idacceso;
    this.correo = correo;
    this.password = password;
    this.tipos = tipos;
    this.estado = estado;
  }

  static updateAcceso(input: any): [string?, UpdateAccesDto?] {
    const resultado = updateAccesoValidator(input);

    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new UpdateAccesDto(resultado.data)];
  }
}
