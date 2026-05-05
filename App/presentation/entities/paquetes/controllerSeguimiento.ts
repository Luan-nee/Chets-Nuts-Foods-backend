import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateSeguimientoDto } from "../../../domain/dto/seguimiento/createSeguimiento.dto.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { CreateSeguimientoUseCase } from "../../../domain/use-cases/seguimiento/createSeguimiento.use-case.js";
import { GetSeguimientoUseCase } from "../../../domain/use-cases/seguimiento/getSeguimientos.use-case.js";

export class controllerSeguimientoPaquete {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [errorID, id] = NumericId.create(req.params);

    if (errorID !== undefined || id === undefined) {
      CustomResponse.badRequest({ res, error: errorID });
      return;
    }

    const [error, seguimientoDto] = CreateSeguimientoDto.create(req.body);

    if (error !== undefined || seguimientoDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const useCase = new CreateSeguimientoUseCase();

    useCase
      .create(id.id, seguimientoDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [error, id] = NumericId.create(req.params);

    if (error !== undefined || id === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const useSeguimiento = new GetSeguimientoUseCase();
    useSeguimiento
      .getAllSeguimiento(id.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
