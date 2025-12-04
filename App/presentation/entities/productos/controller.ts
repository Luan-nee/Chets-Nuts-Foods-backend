import { Request, Response } from "express";
import { QueriesProductoDto } from "./queriesDtoProductos.js";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { GetAllProductos } from "../../../domain/query-params/use-cases/productos/getAllProduct.use-case.js";
import { handleError } from "../../../core/res/hanlde.error.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { GetProductByID } from "../../../domain/query-params/use-cases/productos/getProductById.js";

export class ProductosController {
  getAll = (req: Request, res: Response) => {
    const [, queriesDto] = QueriesProductoDto.create(req.query);

    const productos = new GetAllProductos();
    productos
      .execute(queriesDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error: unknown) => {
        console.log(error);
        handleError(error, res);
      });
  };

  getID = (req: Request, res: Response) => {
    const [error, numericId] = NumericId.create(req.params);
    if (error != null || numericId == undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const getProductById = new GetProductByID();

    getProductById
      .execute(numericId)
      .then((data) => {
        CustomResponse.success({ res, data });
        return;
      })
      .catch((error) => {
        handleError(error, res);
      });
  };
}
