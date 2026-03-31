import { salidaTransType } from "../../../types/global.js";
import { updateSalidaTransporteValidator } from "../../validators/salidaTransporte/salidaTransporte.validator.js";

export class UpdateSalidaTransporteDto {
  public idsalidatransporte: number;
  public idVehiculo?: number;
  public idChoferAcceso?: number;
  public idOrigenEstablecimiento?: number;
  public fechaSalida?: Date;
  public estadoTransporte?: salidaTransType;

  private constructor({
    estadoTransporte,
    fechaSalida,
    idChoferAcceso,
    idOrigenEstablecimiento,
    idVehiculo,
    idsalidatransporte,
  }: UpdateSalidaTransporteDto) {
    this.idsalidatransporte = idsalidatransporte;
    this.idVehiculo = idVehiculo;
    this.idChoferAcceso = idChoferAcceso;
    this.idOrigenEstablecimiento = idOrigenEstablecimiento;
    this.fechaSalida = fechaSalida;
    this.estadoTransporte = estadoTransporte;
  }

  static createSalidaTransporte(
    input: any,
  ): [string?, UpdateSalidaTransporteDto?] {
    const response = updateSalidaTransporteValidator(input);

    if (!response.success) {
      return [response.error.message, undefined];
    }
    return [undefined, new UpdateSalidaTransporteDto(response.data)];
  }
}
