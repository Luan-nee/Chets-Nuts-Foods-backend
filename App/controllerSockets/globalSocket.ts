import { Request } from "express";
import { roomsSocket, socketsResponses } from "../types/global.js";
import { Server as SocketIOServer } from "socket.io";

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

interface roomSocketInterno {
  conexion: SocketIOServer;
  messaje: string;
  response: (roomsSocket | string)[];
  valore: socketsResponses;
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

export const emitRoomSocketInterno = ({
  valore,
  conexion,
  messaje,
  response,
}: roomSocketInterno) => {
  const io = conexion;
  console.log("socket emitido");
  io.to(response).emit(`server::${valore}`, messaje);
};
