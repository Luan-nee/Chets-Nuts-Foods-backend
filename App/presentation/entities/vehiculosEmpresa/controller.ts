import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateCarroDto } from "../../../domain/dto/autosEmpresa/createCarro.dto.js";
import { CreateVehiculoUseCase } from "../../../domain/use-cases/vehiculos/createVehiculo.use-case.js";
import { UpdateCarroDto } from "../../../domain/dto/autosEmpresa/updateCarro.dto.js";

export class VehiculosEmpresaController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes acceso para estar aqui",
      });
      return;
    }

    const [error, vehiculoDto] = CreateCarroDto.createVehiculoAccess(req.body);

    if (error !== undefined || vehiculoDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const vehiculo = new CreateVehiculoUseCase();

    vehiculo
      .createVehiculo(vehiculoDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error2) => {
        CustomResponse.badRequest({ res, error: error2 });
      });
  };

  getAllVehiculos = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos para estar aqui",
      });
      return;
    }

    const vehiculo = new CreateVehiculoUseCase();

    vehiculo
      .getAllVehiculo()
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getAllChoferes = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos para estar aqui",
      });
      return;
    }

    const vehiculo = new CreateVehiculoUseCase();

    vehiculo
      .getChoferes()
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getByID = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const idString = req.params.id;

    if (idString === undefined) {
      CustomResponse.badRequest({ res, error: "Id incorrecto" });
      return;
    }

    const id = Number(idString);

    const vehiculo = new CreateVehiculoUseCase();

    vehiculo
      .selectVehiculo(id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  updateVehiculo = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permiso" });
      return;
    }

    const [error, updateDto] = UpdateCarroDto.createVehiculoAccess(req.body);

    if (error !== undefined || updateDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const vehiculo = new CreateVehiculoUseCase();

    vehiculo
      .updateVehiculo(updateDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error2) => {
        CustomResponse.badRequest({ res, error: error2 });
      });
  };
}
