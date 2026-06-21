import { typeRol } from "../../../types/global.js";
import { createAccesoValidator } from "../../validators/acceso/acceso.validator.js";

export class CreateAccesDto {
  public idusuario?: number;
  public password: string;
  public tipos: typeRol;
  public correo: string;
  public numeroLicenciaConducir?: string;

  private constructor({
    idusuario,
    password,
    tipos,
    correo,
    numeroLicenciaConducir,
  }: CreateAccesDto) {
    this.idusuario = idusuario;
    this.password = password;
    this.tipos = tipos;
    this.correo = correo;
    this.numeroLicenciaConducir = numeroLicenciaConducir;
  }

  static createSessionUserMain(input: any): [string?, CreateAccesDto?] {
    const result = createAccesoValidator(input);
    if (!result.success) {
      return ["Error al iniciar Session", undefined];
    }
    return [undefined, new CreateAccesDto(result.data)];
  }
}
