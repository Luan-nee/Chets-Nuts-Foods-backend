import { queriesProductosValidator } from "../../../domain/validators/productos/producto.validator.js";

export class QueriesProductoDto {
  order: string | undefined;
  page: number | undefined;
  search: string | undefined;

  private constructor({
    order = "",
    search = "",
    page = 0,
  }: QueriesProductoDto) {
    this.order = order;
    this.search = search;
    this.page = page;
  }

  static create(input: any): [string?, QueriesProductoDto?] {
    const resultado = queriesProductosValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }

    return [
      undefined,
      new QueriesProductoDto({
        order: resultado.data.order,
        search: resultado.data.search,
        page: resultado.data.page,
      }),
    ];
  }
}
