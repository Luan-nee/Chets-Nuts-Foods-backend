import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateDatosEmpresaDto } from "../../../domain/dto/datosEmpresa/createDatosEmpresaDto.js";
import { DatosEmpresaUseCase } from "../../../domain/use-cases/datosEmpresa/DatosEmpresaUseCase.js";

export class DatosEmpresaController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }
    const [error, datosEmpresaDto] = CreateDatosEmpresaDto.createDatosEmpresa(
      req.body,
    );

    if (error !== undefined || datosEmpresaDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const dataUseCase = new DatosEmpresaUseCase();

    dataUseCase
      .create(datosEmpresaDto, req.authpayload)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({
          res,
          error,
        });
      });
  };
}
