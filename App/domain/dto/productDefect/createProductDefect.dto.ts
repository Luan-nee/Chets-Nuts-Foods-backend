import { calibreProducto, calidadProducto } from "../../../types/global.js";
import { createProductsDefectValidator } from "../../validators/productsDefect/productsDefect.validator.js";

export class CreateProductsDefectDto {
  public nombre: string;
  public descripcion: string;
  public calidad?: calidadProducto;
  public calibre?: calibreProducto;

  constructor({
    descripcion,
    nombre,
    calidad,
    calibre,
  }: CreateProductsDefectDto) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.calidad = calidad;
    this.calibre = calibre;
  }

  static createProductDefect(input: any): [string?, CreateProductsDefectDto?] {
    console.log(input);
    const resultado = createProductsDefectValidator(input);

    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new CreateProductsDefectDto(resultado.data)];
  }
}
