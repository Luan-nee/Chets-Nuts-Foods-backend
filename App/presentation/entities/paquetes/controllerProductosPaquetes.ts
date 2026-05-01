import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateProductoPaqueteDto } from "../../../domain/dto/productosPaquete/createProducto.dto.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { CreateProductoPaqueteUseCase } from "../../../domain/use-cases/productosPaquetes/createProductoPaquete.use-case.js";
import { GetAllProductosPaqueteUseCase } from "../../../domain/use-cases/productosPaquetes/getAllProductoPaquete.js";

export class ControllerProductosPaquetes {
  registrarProducto = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const [errorNumeric, id] = NumericId.create(req.params);

    if (errorNumeric !== undefined || id === undefined) {
      CustomResponse.badRequest({ res, error: errorNumeric });
      return;
    }

    const [error, packageProduct] = CreateProductoPaqueteDto.create(req.body);

    if (error !== undefined || packageProduct === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const usoProductos = new CreateProductoPaqueteUseCase();

    usoProductos
      .execute(packageProduct, id.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getAllProductos = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "Tienes que tener permisos para acceder aqui",
      });
      return;
    }

    const [error, id] = NumericId.create(req.params);

    if (error !== undefined || id === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const useproduct = new GetAllProductosPaqueteUseCase();

    useproduct
      .execute(id.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
