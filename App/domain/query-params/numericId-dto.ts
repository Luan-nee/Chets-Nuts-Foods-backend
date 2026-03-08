import { ParamNumericIdValidator } from "./queryParams-validator.js";

export class NumericId {
  id: number;

  private constructor({ id }: NumericId) {
    this.id = id;
  }
  static create(input: any): [string?, NumericId?] {
    const resultado = ParamNumericIdValidator(input);
    if (!resultado.success) {
      console.log(resultado.error);
      return ["Id invalido", undefined];
    }
    return [undefined, new NumericId(resultado.data)];
  }
}
