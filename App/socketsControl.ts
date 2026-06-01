import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { validatorTokenSocket } from "./controllerSockets/validateTokenSockets.js";
import { pagePermises, usuariosConectados } from "./consts.js";
import { ManagerSockets } from "./controllerSockets/managerSockets.js";

export default class SocketControl {
  private io: SocketIOServer | null;
  constructor(httpServer: http.Server) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: pagePermises,
        credentials: true,
      },
    });
  }

  getIo() {
    if (!this.io) throw new Error("socket io iniciado");
    return this.io;
  }

  principalConection() {
    if (this.io === null) throw new Error("La conexion es obligatorio");

    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log("Un intento de token invalido");
        return next(new Error("TOKEN_INVALIDO"));
      }
      const user = await validatorTokenSocket(token);
      if (!user.estado) {
        console.log("intento de colarse rechazado");
        return next(new Error("TOKEN_EXPIRADO"));
      }
      socket.data.user = user;
      next();
    });

    this.io.on("connection", async (usuario) => {
      console.log(`usuario : ${usuario.id}`);

      const tokenBefore = usuario.handshake.auth.token as string;
      const user = await validatorTokenSocket(tokenBefore);

      const { paquetes, salidatransporte } =
        await ManagerSockets.managerControls(
          user.message,
          user.id,
          user.codigo,
        );

      if (paquetes !== undefined) {
        usuario.join(paquetes);
      }

      if (salidatransporte !== undefined) {
        usuario.join(salidatransporte);
      }

      usuario.on("disconnet", () => {
        const sockets = usuariosConectados.get(user.codigo);
        sockets?.delete(usuario.id);
        if (sockets?.size === 0) {
          usuariosConectados.delete(user.codigo);
        }
      });
    });
  }
}
