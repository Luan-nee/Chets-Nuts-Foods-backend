import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreatePaqueteDto } from "../../../domain/dto/paquetes/createpaqueteDto.js";
import { CreatePaqueteUseCase } from "../../../domain/use-cases/paquetes/createPaquete.use-case.js";
import {
  emitRoomSocket,
  emitSocket,
} from "../../../controllerSockets/globalSocket.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";
import { GetAllPaqueteUseCase } from "../../../domain/use-cases/paquetes/getAllPaquete.js";
import { getpaqueteId } from "../../../domain/use-cases/paquetes/getByIDPaquete.use-case.js";

export class PaquetesController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "NO tienes permisos de estar aqui",
      });
      return;
    }

    const idEstablecimiento = req.authpayload.establecimiento;

    const [error, paqueteDto] = CreatePaqueteDto.createPaquete(req.body);

    if (error !== undefined || paqueteDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const paqueteUse = new CreatePaqueteUseCase();
    paqueteUse
      .execute(paqueteDto)
      .then((data) => {
        if (idEstablecimiento !== undefined) {
          emitRoomSocket({
            data,
            req,
            response: "ESTABLECIMIENTO",
            valore: "createpaquete",
            codigo: idEstablecimiento,
          });
        }

        emitRoomSocket({
          data,
          req,
          response: "ADMINS",
          valore: "createpaquete",
        });

        CustomResponse.success({ res, data: "Paquete generado con exito" });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
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

    const [error, idPaquete] = NumericId.create(req.params);
    console.log(idPaquete);
    if (error !== undefined || idPaquete === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const getAlluse = new GetAllPaqueteUseCase();
    getAlluse
      .execute(idPaquete.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };
  getByID = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [error, idPaquete] = NumericId.create(req.params);
    if (error !== undefined || idPaquete === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    getpaqueteId(idPaquete.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };
}
