import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateSalidaTransporteDto } from "../../../domain/dto/salidaTransporte/createSalidaTransporte.dto.js";

export class SalidaTransporte {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const [error, salTransDTO] =
      CreateSalidaTransporteDto.createSalidaTransporte(req.body);

    if (error !== undefined || salTransDTO === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }
  };
}
