import { responseZodError } from "../../core/config/responseZodError.js";
import { salidaTransType } from "../../types/global.js";
import { ParamPageValidator } from "./queryParams-validator.js";

export class PageDataDto {
  public page: number = 1;
  public salida?: salidaTransType = "INICIO";

  constructor({ page, salida }: PageDataDto) {
    this.page = page;
    this.salida = salida;
  }

  static create(input: any): [PageDataDto, string?] {
    const resultado = ParamPageValidator(input);
    if (!resultado.success) {
      const errores = responseZodError(resultado);
      return [new PageDataDto({ page: 1 }), errores];
    }
    return [new PageDataDto(resultado.data), undefined];
  }
}
