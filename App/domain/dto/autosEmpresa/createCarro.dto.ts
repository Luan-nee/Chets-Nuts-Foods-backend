import { responseZodError } from "../../../core/config/responseZodError.js";
import { createVehiculoValidator } from "../../validators/carros/vehiculosValidator.js";

export class CreateCarroDto {
  public placa: string;
  public marca: string;
  public modelo: string;
  public anio: string;
  public tipoVehiculo: string;
  public vin?: string;
  public numeroHabilitacion?: string;
  public capacidadCarga: number;
  public tipo?: "PUBLICO" | "PRIVADO";

  private constructor({
    anio,
    capacidadCarga,
    marca,
    modelo,
    placa,
    tipoVehiculo,
    vin,
    numeroHabilitacion,
    tipo,
  }: CreateCarroDto) {
    this.anio = anio;
    this.capacidadCarga = capacidadCarga;
    this.marca = marca;
    this.modelo = modelo;
    this.placa = placa;
    this.tipoVehiculo = tipoVehiculo;
    this.vin = vin;
    this.numeroHabilitacion = numeroHabilitacion;
    this.tipo = tipo;
  }

  static createVehiculoAccess(input: any): [string?, CreateCarroDto?] {
    const resultado = createVehiculoValidator(input);
    if (!resultado.success) {
      const datos = responseZodError(resultado);
      return [datos, undefined];
    }
    return [undefined, new CreateCarroDto(resultado.data)];
  }
}
