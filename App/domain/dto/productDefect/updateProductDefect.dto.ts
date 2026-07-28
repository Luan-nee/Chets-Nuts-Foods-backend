import { calibreProducto, calidadProducto } from "../../../types/global.js";
import { updateProductsDefectValidator } from "../../validators/productsDefect/productsDefect.validator.js";

export class UpdateProductDefectDto {
  public idProductDefect: number;
  public nombre?: string;
  public descripcion?: string;
  public calidad?: calidadProducto;
  public calibre?: calibreProducto;

  private constructor({
    descripcion,
    nombre,
    idProductDefect,
    calidad,
    calibre,
  }: UpdateProductDefectDto) {
    this.idProductDefect = idProductDefect;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.calidad = calidad;
    this.calibre = calibre;
  }

  static updateProductDefect(input: any): [string?, UpdateProductDefectDto?] {
    const resultado = updateProductsDefectValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    return [undefined, new UpdateProductDefectDto(resultado.data)];
  }
}
