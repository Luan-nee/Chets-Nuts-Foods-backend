import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateEstablecimientoDto } from "../../../domain/dto/establecimientos/createEstablecimiento.dto.js";
import { EstablecimientosUseCase } from "../../../domain/use-cases/establecimientos/establecimiento.use-case.js";

export class EstablecimientosController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes autorizacion" });
      return;
    }

    const [error, establecimientoDto] =
      CreateEstablecimientoDto.CreateEstablecimientoAccess(req.body);
    if (error !== undefined || establecimientoDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const establecimientoUse = new EstablecimientosUseCase();

    establecimientoUse
      .create(establecimientoDto, req.authpayload.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
