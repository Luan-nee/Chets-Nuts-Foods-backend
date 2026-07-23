import { estadoPaquete } from "../../../types/global.js";
import { updateEstadoPaqueteValidator } from "../../validators/paquetes/paquetes.validator.js";

export class UpdateEstadoDto {
  public estado: estadoPaquete;

  private constructor({ estado }: UpdateEstadoDto) {
    this.estado = estado;
  }

  static createUpdatePaquete(input: any): [string?, UpdateEstadoDto?] {
    const validator = updateEstadoPaqueteValidator(input);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, new UpdateEstadoDto(validator.data)];
  }
}
