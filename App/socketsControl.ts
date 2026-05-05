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
    this.io.on("connection", async (usuario) => {
      console.log(`usuario : ${usuario.id}`);

      if (usuario.handshake.auth.token === undefined) {
        usuario.disconnect();
      }

      const tokenBefore = usuario.handshake.auth.token as string;
      const user = await validatorTokenSocket(tokenBefore);

      if (!user.estado) {
        usuario.disconnect();
      }

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
