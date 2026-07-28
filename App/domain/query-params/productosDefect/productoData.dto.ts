import { responseZodError } from "../../../core/config/responseZodError.js";
import { calibreProducto, calidadProducto } from "../../../types/global.js";
import { ParamProducQuerytValidator } from "../queryParams-validator.js";

export class ProductoDataDto {
  public page: number = 1;
  public calidad?: calidadProducto;
  public calibre?: calibreProducto;

  constructor({ page, calibre, calidad }: ProductoDataDto) {
    this.page = page;
    this.calidad = calidad;
    this.calibre = calibre;
  }

  static create(input: any): [ProductoDataDto, string?] {
    const resultado = ParamProducQuerytValidator(input);

    if (!resultado.success) {
      const errores = responseZodError(resultado);
      return [new ProductoDataDto({ page: 1 }), errores];
    }
    return [new ProductoDataDto(resultado.data)];
  }
}
