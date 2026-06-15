import { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../../core/res/custom.response.js";

export const noClientAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.authpayload === undefined) {
    CustomResponse.unauthorized({
      res,
      error: "No tienes permisos para estar aqui",
    });
    return;
  }

  if (req.authpayload.rol === "CLIENTE") {
    CustomResponse.unauthorized({
      res,
      error: "Como cliente no puedes acceder a estar rutas",
    });
    return;
  }
  next();
};

export const ClientAccessMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.authpayload === undefined) {
    CustomResponse.unauthorized({
      res,
      error: "No tienes permisos para estar aqui",
    });
    return;
  }

  if (req.authpayload.rol !== "CLIENTE") {
    CustomResponse.unauthorized({
      res,
      error: "Solo pueden acceder los clientes",
    });
    return;
  }
  next();
};
