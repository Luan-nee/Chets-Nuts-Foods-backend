import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateEstablecimientoDto } from "../../../domain/dto/establecimientos/createEstablecimiento.dto.js";
import { EstablecimientosUseCase } from "../../../domain/use-cases/establecimientos/establecimiento.use-case.js";
import { UpdateEstablecimientoDTO } from "../../../domain/dto/establecimientos/updateEstablecimiento.dto.js";

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
      .create(establecimientoDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error1) => {
        console.log(error1);
        CustomResponse.badRequest({ res, error: error1 });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const useEstablecimiento = new EstablecimientosUseCase();
    useEstablecimiento
      .getAll()
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getByid = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const id = Number(req.params.id);
    if (id === undefined) {
      CustomResponse.badRequest({ res, error: "No hay un numero" });
      return;
    }
    const useEstablecimiento = new EstablecimientosUseCase();
    useEstablecimiento
      .getEstablecimientoId(id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  update = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const [error, updateDto] =
      UpdateEstablecimientoDTO.CreateEstablecimientoAccess(req.body);

    console.log(updateDto);
    if (error !== undefined || updateDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const useEstablecimiento = new EstablecimientosUseCase();
    useEstablecimiento
      .update(updateDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
