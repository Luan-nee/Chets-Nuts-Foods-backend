import { createVehiculoValidator } from "../../validators/carros/vehiculosValidator.js";

export class CreateCarroDto {
  public placa: string;
  public marca: string;
  public modelo: string;
  public anio: string;
  public tipoVehiculo: string;
  public capacidadCarga: number;

  private constructor({
    anio,
    capacidadCarga,
    marca,
    modelo,
    placa,
    tipoVehiculo,
  }: CreateCarroDto) {
    this.anio = anio;
    this.capacidadCarga = capacidadCarga;
    this.marca = marca;
    this.modelo = modelo;
    this.placa = placa;
    this.tipoVehiculo = tipoVehiculo;
  }

  static createVehiculoAccess(input: any): [string?, CreateCarroDto?] {
    const resultado = createVehiculoValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new CreateCarroDto(resultado.data)];
  }
}
