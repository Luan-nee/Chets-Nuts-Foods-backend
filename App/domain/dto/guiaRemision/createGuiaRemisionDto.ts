import { responseZodError } from "../../../core/config/responseZodError.js";
import { createGuiaRemisionValidator } from "../../validators/guiaRemision/guiaRemision.validator.js";

export class CreateGuiaRemisionDto {
  public motivoTraslado?: "01" | "02" | "03" | "06";
  public docDestinatario?: "DNI" | "RUC";
  public modalidadTransporte?: "01" | "02";

  private constructor({
    modalidadTransporte,
    motivoTraslado,
    docDestinatario,
  }: CreateGuiaRemisionDto) {
    this.docDestinatario = docDestinatario;
    this.modalidadTransporte = modalidadTransporte;
    this.motivoTraslado = motivoTraslado;
  }

  static create(input: any): [string?, CreateGuiaRemisionDto?] {
    const response = createGuiaRemisionValidator(input);

    if (!response.success) {
      const error = responseZodError(response);

      return [error, undefined];
    }
    return [undefined, new CreateGuiaRemisionDto(response.data)];
  }
}
