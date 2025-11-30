import { Request, Response } from "express";
import { QueriesProductoDto } from "./queriesDtoProductos.js";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { GetAllProductos } from "../../../domain/query-params/use-cases/productos/getAllProduct.use-case.js";
import { handleError } from "../../../core/res/hanlde.error.js";

export class ProductosController {
  getAll = (req: Request, res: Response) => {
    const [error, queriesDto] = QueriesProductoDto.create(req.query);
    if (error !== undefined || queriesDto == undefined)
      CustomResponse.badRequest({ res, error });

    const productos = new GetAllProductos();
    productos
      .execute(queriesDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error: unknown) => {
        handleError(error, res);
      });
  };
}
