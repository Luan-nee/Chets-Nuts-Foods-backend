import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateDatosEmpresaDto } from "../../../domain/dto/datosEmpresa/createDatosEmpresaDto.js";
import { DatosEmpresaUseCase } from "../../../domain/use-cases/datosEmpresa/DatosEmpresaUseCase.js";
import { UpdateDatosEmpresaDTO } from "../../../domain/dto/datosEmpresa/updateDatosEmpresaDto.js";

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

  getdatos = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const datosUseCase = new DatosEmpresaUseCase();

    datosUseCase
      .getAll()
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

  update = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de star aqui",
      });
      return;
    }

    const [error, datosEmpresa] = UpdateDatosEmpresaDTO.createDatosEmpresa(
      req.body,
    );

    if (error !== undefined || datosEmpresa === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const datosUse = new DatosEmpresaUseCase();

    datosUse
      .update(datosEmpresa)
      .then((data) => {
        CustomResponse.success({
          res,
          data: { message: "Actualizado con exito" },
        });
      })
      .catch((error) => {
        CustomResponse.badRequest({
          res,
          error: "Ocurrio un error al momento de actualizar",
        });
      });
  };
}
