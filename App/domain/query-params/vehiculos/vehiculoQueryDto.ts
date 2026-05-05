import { responseZodError } from "../../../core/config/responseZodError.js";
import { estadoVehiculo } from "../../../types/global.js";
import { queryValidatorVehiculo } from "./vehiculoQuery-Schema.js";

export class VehiculoQueryDto {
  public estado?: estadoVehiculo | "ALL";
  public tipo?: "PUBLICO" | "PRIVADO" | "ALL";
  public page: number = 0;

  private constructor({ estado, page, tipo }: VehiculoQueryDto) {
    this.estado = estado;
    this.page = page;
    this.tipo = tipo;
  }

  static create(input: any): [VehiculoQueryDto, string?] {
    const response = queryValidatorVehiculo(input);

    if (!response.success) {
      const error = responseZodError(response);

      return [
        new VehiculoQueryDto({ estado: "ALL", page: 0, tipo: "ALL" }),
        error,
      ];
    }
    return [new VehiculoQueryDto(response.data), undefined];
  }
}
