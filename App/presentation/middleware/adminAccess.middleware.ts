import { NextFunction, Request, Response } from "express";
import { CustomResponse } from "../../core/res/custom.response.js";
import { AND, DB, eq } from "zormz";
import { generateTables } from "../../BD-Control.js";

export const adminAccess = async (
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

  if (req.authpayload.rol !== "ADMIN") {
    CustomResponse.unauthorized({
      res,
      error: "Solo administradores pueden estar aqui",
    });
  }
  const auth = req.authpayload;
  const { accesos } = generateTables();
  const validateUser = await DB.Select([accesos.tipos, accesos.idacceso])
    .from(accesos())
    .where(
      AND(
        eq(accesos.idacceso, auth.id),
        eq(accesos.estado, true),
        eq(accesos.tipos, "ADMIN"),
      ),
    )
    .execute();

  if (validateUser === undefined || validateUser.length === 0) {
    CustomResponse.unauthorized({
      res,
      error: "Ups, parece que tu acceso ah sido revocado",
    });
    return;
  }
  next();
};
