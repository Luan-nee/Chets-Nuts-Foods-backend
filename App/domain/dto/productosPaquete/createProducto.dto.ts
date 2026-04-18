import { createProductoValidator } from "../../validators/producto/producto.validator.js";

export class CreateProductoPaqueteDto {
  public nombreproducto: string;
  public observacion?: string;
  public peso: number;

  constructor({ nombreproducto, peso, observacion }: CreateProductoPaqueteDto) {
    this.nombreproducto = nombreproducto;
    this.observacion = observacion;
    this.peso = peso;
  }

  static create(input: any): [string?, CreateProductoPaqueteDto?] {
    const resultado = createProductoValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new CreateProductoPaqueteDto(resultado.data)];
  }
}
