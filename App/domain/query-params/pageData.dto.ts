import { ParamPageValidator } from "./queryParams-validator.js";

export class PageDataDto {
  public page: number = 0;

  constructor({ page }: PageDataDto) {
    this.page = page;
  }

  static create(input: any) {
    const resultado = ParamPageValidator(input);
    if (!resultado.success) {
      return new PageDataDto({ page: 0 });
    }
    return new PageDataDto(resultado.data);
  }
}
