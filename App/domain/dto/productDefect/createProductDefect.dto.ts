import { createProductsDefectValidator } from "../../validators/productsDefect/productsDefect.validator.js";

export class CreateProductsDefectDto {
  public nombre: string;
  public descripcion: string;

  constructor({ descripcion, nombre }: CreateProductsDefectDto) {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  static createProductDefect(input: any): [string?, CreateProductsDefectDto?] {
    const resultado = createProductsDefectValidator(input);

    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new CreateProductsDefectDto(resultado.data)];
  }
}
