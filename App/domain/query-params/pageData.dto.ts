import { responseZodError } from "../../core/config/responseZodError.js";
import { ParamPageValidator } from "./queryParams-validator.js";

export class PageDataDto {
  public page: number = 1;

  constructor({ page }: PageDataDto) {
    this.page = page;
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
