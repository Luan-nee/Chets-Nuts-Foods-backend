import { Request } from "express";
import { socketsResponses } from "../types/global.js";

export const emitSocket = (
  req: Request,
  response: socketsResponses,
  data: any,
) => {
  const io = req.app.locals.io;
  req.app.locals.io;
  io.emit(`server::${response}`, data);
};
