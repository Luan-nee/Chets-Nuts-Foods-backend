import { estadoPaquete } from "../../../types/global.js";
import { createDatosEmpresaValidator } from "../../validators/datosEmpresa/datosEmpresaValidator.js";
import { createPaquetesValidator } from "../../validators/paquetes/paquetes.validator.js";

export class CreatePaqueteDto {
  public idUsuario: number;
  public idUsuarioDestino: number;
  public idSalidaTransporte: number;
  public idDestinoEstablecimiento?: number;
  public destino?: string;
  public clave: string;
  public montoCobrado: number;
  public observacion?: string;

  private constructor({
    clave,
    destino,
    observacion,
    idSalidaTransporte,
    idUsuario,
    idUsuarioDestino,
    montoCobrado,
    idDestinoEstablecimiento,
  }: CreatePaqueteDto) {
    this.clave = clave;
    this.destino = destino;
    this.idSalidaTransporte = idSalidaTransporte;
    this.idUsuario = idUsuario;
    this.idUsuarioDestino = idUsuarioDestino;
    this.montoCobrado = montoCobrado;
    this.idDestinoEstablecimiento = idDestinoEstablecimiento;
    this.observacion = observacion;
    console.log("agregando datos");
  }

  static createPaquete(input: any): [string?, CreatePaqueteDto?] {
    const validator = createPaquetesValidator(input);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, new CreatePaqueteDto(validator.data)];
  }
}
