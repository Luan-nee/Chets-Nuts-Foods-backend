import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { validatorTokenSocket } from "./controllerSockets/validateTokenSockets.js";
import { pagePermises, usuariosConectados } from "./consts.js";

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
      const tokenBefore = usuario.handshake.auth.token as string;
      const user = await validatorTokenSocket(tokenBefore);
      if (!user.estado) {
        usuario.disconnect();
      }
      if (!usuariosConectados.has(user.codigo)) {
        usuariosConectados.set(user.codigo, new Set());
      }

      usuariosConectados.get(user.codigo)?.add(usuario.id);

      if (user.message === "ESTABLECIMIENTO" && user.codigo !== undefined) {
        usuario.join(user.message + user.codigo);
      } else {
        usuario.join(user.message);
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
