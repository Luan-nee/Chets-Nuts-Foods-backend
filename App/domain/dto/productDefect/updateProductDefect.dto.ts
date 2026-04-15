import { updateProductsDefectValidator } from "../../validators/productsDefect/productsDefect.validator.js";

export class UpdateProductDefectDto {
  public idProductDefect: number;
  public nombre?: string;
  public descripcion?: string;

  private constructor({
    descripcion,
    nombre,
    idProductDefect,
  }: UpdateProductDefectDto) {
    this.idProductDefect = idProductDefect;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  static updateProductDefect(input: any): [string?, UpdateProductDefectDto?] {
    const resultado = updateProductsDefectValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new UpdateProductDefectDto(resultado.data)];
  }
}
