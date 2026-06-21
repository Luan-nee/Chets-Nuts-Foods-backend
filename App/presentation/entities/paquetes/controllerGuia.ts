import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { CreateGuiaUseCase } from "../../../domain/use-cases/emisionGuia/createGuia.use-case.js";
import { CreateGuiaRemisionDto } from "../../../domain/dto/guiaRemision/createGuiaRemisionDto.js";
import { PageDataDto } from "../../../domain/query-params/pageData.dto.js";
import { GetAllGR } from "../../../domain/use-cases/emisionGuia/getAllGR.use-case.js";

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
      .then((data) => {
        CustomResponse.success({ res, message: "Creado con exito", data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: " NO tienes permisos de estar aqui",
      });
      return;
    }

    const [pages, error] = PageDataDto.create(req.query);

    const useGet = new GetAllGR();

    useGet
      .getAll(pages)
      .then(({ data, pagination }) => {
        CustomResponse.success({
          res,
          message: `Listado de guias de remision `,
          error,
          data,
          pagination,
        });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
