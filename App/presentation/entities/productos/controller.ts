import { Request, Response } from "express";
import { QueriesProductoDto } from "./queriesDtoProductos.js";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { GetAllProductos } from "../../../domain/query-params/use-cases/productos/getAllProduct.use-case.js";
import { handleError } from "../../../core/res/hanlde.error.js";

export class ProductosController {
  getAll = (req: Request, res: Response) => {
    console.log(req.query);
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
}
