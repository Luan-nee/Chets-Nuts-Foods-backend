import { responseZodError } from "../../../core/config/responseZodError.js";
import { createSessionClientValidator } from "../../validators/auth/sessionValidator.js";

export class ClientLoginDTO {
  public sala: string;
  public dni: string;
  public clave: string;

  private constructor({ clave, dni, sala }: ClientLoginDTO) {
    this.sala = sala;
    this.dni = dni;
    this.clave = clave;
  }

  static createClientSeccion(input: any): [string?, ClientLoginDTO?] {
    const result = createSessionClientValidator(input);
    if (!result.success) {
      const error = responseZodError(result);
      return [error, undefined];
    }
    return [undefined, new ClientLoginDTO(result.data)];
  }
}
