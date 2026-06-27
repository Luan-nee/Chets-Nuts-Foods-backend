import { responseZodError } from "../../../core/config/responseZodError.js";
import { createGuiaRemisionValidator } from "../../validators/guiaRemision/guiaRemision.validator.js";

export class CreateGuiaRemisionDto {
  public motivoTraslado?: "01" | "02" | "03" | "06";
  public docDestinatario?: "DNI" | "RUC";
  public modalidadTransporte?: "01" | "02";
  public idDataEmpresa?: number;
  public codigoTransporte?: number;

  private constructor({
    modalidadTransporte,
    motivoTraslado,
    docDestinatario,
    idDataEmpresa,
    codigoTransporte,
  }: CreateGuiaRemisionDto) {
    this.docDestinatario = docDestinatario;
    this.modalidadTransporte = modalidadTransporte;
    this.motivoTraslado = motivoTraslado;
    this.idDataEmpresa = idDataEmpresa;
    this.codigoTransporte = codigoTransporte;
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
