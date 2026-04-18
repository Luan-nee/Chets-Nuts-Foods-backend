import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateProductoPaqueteDto } from "../../../domain/dto/productosPaquete/createProducto.dto.js";

export class ProductosPaquetes {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [error, productoDto] = CreateProductoPaqueteDto.create(req.body);

    if (error !== undefined || productoDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }
  };
}
