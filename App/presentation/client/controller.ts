import { Request, Response } from "express";
import { CustomResponse } from "../../core/res/custom.response.js";
import { ClientUseCase } from "./cliente.use-case.js";

export class ControllerCliente {
  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const idpaquete = req.authpayload.id;
    const useCase = new ClientUseCase();
    useCase
      .getpackage(idpaquete)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getProductos = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const idPaquete = req.authpayload.id;

    const useClient = new ClientUseCase();

    useClient
      .getProductos(idPaquete)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getSeguimiento = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const idPaquete = req.authpayload.id;

    const useClient = new ClientUseCase();

    useClient
      .getSeguimientoProducts(idPaquete)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
