import { salidaTransType } from "../../../types/global.js";
import { createSalidaTransporteValidator } from "../../validators/salidaTransporte/salidaTransporte.validator.js";

export class CreateSalidaTransporteDto {
  public idVehiculo: number;
  public idChoferAcceso: number;
  public idOrigenEstablecimiento: number;
  public idDestinoEstablecimiento: number;
  public fechaSalida: Date;

  private constructor({
    fechaSalida,
    idChoferAcceso,
    idOrigenEstablecimiento,
    idDestinoEstablecimiento,
    idVehiculo,
  }: CreateSalidaTransporteDto) {
    this.idVehiculo = idVehiculo;
    this.idChoferAcceso = idChoferAcceso;
    this.idOrigenEstablecimiento = idOrigenEstablecimiento;
    this.idDestinoEstablecimiento = idDestinoEstablecimiento;
    this.fechaSalida = fechaSalida;
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
