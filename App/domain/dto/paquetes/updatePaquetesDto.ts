import { updatePaquetesValidator } from "../../validators/paquetes/paquetes.validator.js";

export class UpdatePaqueteDto {
  public idUsuario?: number;
  public idUsuarioDestino?: number;
  public idSalidaTransporte?: number;
  public idDestinoEstablecimiento?: number;
  public destino?: string;
  public clave?: string;
  public montoCobrado?: number;
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
  }: UpdatePaqueteDto) {
    this.clave = clave;
    this.destino = destino;
    this.idSalidaTransporte = idSalidaTransporte;
    this.idUsuario = idUsuario;
    this.idUsuarioDestino = idUsuarioDestino;
    this.montoCobrado = montoCobrado;
    this.idDestinoEstablecimiento = idDestinoEstablecimiento;
    this.observacion = observacion;
  }

  static createUpdatePaquete(input: any): [string?, UpdatePaqueteDto?] {
    const validator = updatePaquetesValidator(input);
    if (!validator.success) {
      return [validator.error.message, undefined];
    }
    return [undefined, new UpdatePaqueteDto(validator.data)];
  }
}
