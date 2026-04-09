import { estadoVehiculo } from "../../../types/global.js";
import { updateVehiculoValidator } from "../../validators/carros/vehiculosValidator.js";

export class UpdateCarroDto {
  public idVehiculo: number;
  public marca?: string;
  public modelo?: string;
  public anio?: string;
  public tipoVehiculo?: string;
  public vin?: string;
  public numeroHabilitacion?: string;
  public capacidadCarga?: number;
  public estadoVehiculo?: estadoVehiculo;

  private constructor({
    anio,
    capacidadCarga,
    marca,
    modelo,
    tipoVehiculo,
    vin,
    numeroHabilitacion,
    idVehiculo,
    estadoVehiculo,
  }: UpdateCarroDto) {
    this.anio = anio;
    this.capacidadCarga = capacidadCarga;
    this.marca = marca;
    this.modelo = modelo;
    this.tipoVehiculo = tipoVehiculo;
    this.vin = vin;
    this.numeroHabilitacion = numeroHabilitacion;
    this.idVehiculo = idVehiculo;
    this.estadoVehiculo = estadoVehiculo;
  }

  static createVehiculoAccess(input: any): [string?, UpdateCarroDto?] {
    const resultado = updateVehiculoValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new UpdateCarroDto(resultado.data)];
  }
}
