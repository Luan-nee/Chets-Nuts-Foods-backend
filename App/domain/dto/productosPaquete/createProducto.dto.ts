import { createProductoValidator } from "../../validators/producto/producto.validator.js";

export class CreateProductoPaqueteDto {
  public nombreproducto: string;
  public observacion?: string;
  public cantidad: number;
  public pesounitario: number;

  constructor({
    nombreproducto,
    pesounitario,
    observacion,
    cantidad,
  }: CreateProductoPaqueteDto) {
    this.nombreproducto = nombreproducto;
    this.observacion = observacion;
    this.pesounitario = pesounitario;
    this.cantidad = cantidad;
  }

  static create(input: any): [string?, CreateProductoPaqueteDto?] {
    const resultado = createProductoValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new CreateProductoPaqueteDto(resultado.data)];
  }
}
