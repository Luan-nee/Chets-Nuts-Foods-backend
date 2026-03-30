import { salidaTransType } from "../../../types/global.js";
import { createSalidaTransporteValidator } from "../../validators/salidaTransporte/salidaTransporte.validator.js";

export class CreateSalidaTransporteDto {
  public idVehiculo: number;
  public idChoferAcceso: number;
  public idOrigenEstablecimiento: number;
  public fechaSalida: Date;
  public estadoTransporte: salidaTransType;

  private constructor({
    estadoTransporte,
    fechaSalida,
    idChoferAcceso,
    idOrigenEstablecimiento,
    idVehiculo,
  }: CreateSalidaTransporteDto) {
    this.idVehiculo = idVehiculo;
    this.idChoferAcceso = idChoferAcceso;
    this.idOrigenEstablecimiento = idOrigenEstablecimiento;
    this.fechaSalida = fechaSalida;
    this.estadoTransporte = estadoTransporte;
  }

  static createSalidaTransporte(
    input: any,
  ): [string?, CreateSalidaTransporteDto?] {
    const response = createSalidaTransporteValidator(input);

    if (!response.success) {
      return [response.error.message, undefined];
    }
    return [undefined, new CreateSalidaTransporteDto(response.data)];
  }
}
