import { orderValues } from "../../../consts.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { queriesProductosValidator } from "../../../domain/validators/productos/producto.validator.js";
import { QueriesDtoType } from "../../../types/zod.js";

export class QueriesProductoDto {
  sortBy: QueriesDtoType["sortBy"];
  order: QueriesDtoType["order"];
  filter: QueriesDtoType["filter"];
  search: QueriesDtoType["search"];

  private constructor({ sortBy, order, filter, search }: QueriesProductoDto) {
    this.sortBy = sortBy;
    this.filter = filter;
    this.order = order;
    this.search = search;
  }

  private static isValidOrder(
    order: string
  ): order is keyof typeof orderValues {
    return Object.keys(orderValues).includes(order);
  }

  static create(input: any): [string?, QueriesProductoDto?] {
    const resultado = queriesProductosValidator(input);
    if (!resultado.success) {
      return [resultado.error.message, undefined];
    }
    if (this.isValidOrder(resultado.data.order)) {
      throw CustomError.internalServer();
    }
    return [
      undefined,
      new QueriesProductoDto({
        order: resultado.data.order,
        filter: resultado.data.filter,
        search: resultado.data.search,
        sortBy: resultado.data.sortBy,
      }),
    ];
  }
}
