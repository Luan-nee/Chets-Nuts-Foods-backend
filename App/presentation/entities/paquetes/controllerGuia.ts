import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { CreateGuiaUseCase } from "../../../domain/use-cases/emisionGuia/createGuia.use-case.js";
import { CreateGuiaRemisionDto } from "../../../domain/dto/guiaRemision/createGuiaRemisionDto.js";

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

    const [error2, guia] = CreateGuiaRemisionDto.create(req.body);

    if (error2 !== undefined || guia === undefined) {
      CustomResponse.badRequest({ res, error: error2 });
      return;
    }

    const generateGuia = new CreateGuiaUseCase();

    generateGuia
      .execute(id.id, guia)
      .then(() => {
        CustomResponse.success({ res, data: "Creado con exito" });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
