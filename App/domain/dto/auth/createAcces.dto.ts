import { typeRol } from "../../../types/global.js";
import { createSessionValidator } from "../../validators/auth/sessionValidator.js";

export class CreateAccesDto {
  public usuario: string;
  public password: string;
  public tipos: typeRol;
  public idUser: number;

  private constructor({ idUser, usuario, password, tipos }: CreateAccesDto) {
    this.usuario = usuario;
    this.password = password;
    this.tipos = tipos;
    this.idUser = idUser;
  }

  static createSessionUserMain(input: any): [string?, CreateAccesDto?] {
    const result = createSessionValidator(input);
    if (!result.success) {
      return ["Error al iniciar Session", undefined];
    }
    return [undefined, new CreateAccesDto(result.data)];
  }
}
