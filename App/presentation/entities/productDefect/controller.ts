import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateProductsDefectDto } from "../../../domain/dto/productDefect/createProductDefect.dto.js";
import { CreateProductDefectUseCase } from "../../../domain/use-cases/productDefect/createProductDefect.use-case.js";
import { emitSocket } from "../../../controllerSockets/globalSocket.js";
import { PageDataDto } from "../../../domain/query-params/pageData.dto.js";
import { UpdateProductDefectDto } from "../../../domain/dto/productDefect/updateProductDefect.dto.js";
import { UpdateProductDefectUseCase } from "../../../domain/use-cases/productDefect/updateProductDefect.use-case.js";

export class ProductosDefectController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [error, dtoDefect] = CreateProductsDefectDto.createProductDefect(
      req.body,
    );

    if (error !== undefined || dtoDefect === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const use = new CreateProductDefectUseCase();
    use
      .create(dtoDefect, req.authpayload.id)
      .then(async (data) => {
        await emitSocket(req, "newProductDefect", data);
        CustomResponse.success({ res, data });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const page = PageDataDto.create(req.query);
    const use = new CreateProductDefectUseCase();

    use
      .getAll(page)
      .then(({ data, pagination }) => {
        CustomResponse.success({ res, data, pagination });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };

  update = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "NO tienes permisos para estar aqui",
      });
      return;
    }

    const [error, updateDto] = UpdateProductDefectDto.updateProductDefect(
      req.body,
    );

    if (error !== undefined || updateDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const useUpdate = new UpdateProductDefectUseCase();

    useUpdate
      .execute(updateDto)
      .then((data) => {
        emitSocket(req, "updateProductDefect", data);
        CustomResponse.success({ res, data });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };
}
