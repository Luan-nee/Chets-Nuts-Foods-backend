import { Request } from "express";
import { roomsSocket, socketsResponses } from "../types/global.js";

export const emitSocket = (
  req: Request,
  response: socketsResponses,
  data: any,
) => {
  const io = req.app.locals.io;
  io.emit(`server::${response}`, data);
};

interface roomSockets {
  req: Request;
  response: roomsSocket;
  valore: socketsResponses;
  codigo?: number;
  data: any;
}

export const emitRoomSocket = ({
  data,
  req,
  response,
  valore,
  codigo,
}: roomSockets) => {
  const io = req.app.locals.io;
  let room = codigo === undefined ? response : response + codigo;
  io.to(room).emit(`server::${valore}`, data);
};
