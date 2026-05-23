import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { CreateGuiaUseCase } from "../../../domain/use-cases/emisionGuia/createGuia.use-case.js";

export class controllerGuiaRemision {
  create = (req: Request, res: Response) => {
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

    const generateGuia = new CreateGuiaUseCase();

    generateGuia
      .execute(id.id)
      .then(() => {
        CustomResponse.success({ res, data: "Creado con exito" });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
