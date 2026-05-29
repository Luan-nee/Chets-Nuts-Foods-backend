import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { JsonSyntaxError } from "../../types/config.js";

export const errorMidleware = (
  err: JsonSyntaxError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "El JSON enviado es inválido",
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Error interno del servidor",
  });
};
