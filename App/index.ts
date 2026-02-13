import http from "http";
import APP from "./app.js";
import { env } from "process";
import SocketControl from "./socketsControl.js";
import { envs } from "./core/config/envs.js";
import { connecionLocal, getConexion } from "zormz";

const { DB_DATABASE, DB_HOST, DB_PASS, DB_PORT, DB_USER } = envs;

const conexion: connecionLocal = {
  database: DB_DATABASE,
  host: DB_HOST,
  password: DB_PASS,
  port: DB_PORT,
  user: DB_USER,
};

getConexion("mysql", conexion);

const server = http.createServer(APP);
const PORT = env.port || 4000;

const httpServer = server.listen(PORT, () => {
  console.log(
    `\n ======== Servidor Z en linea ==========\n \t 
      http://localhost:${PORT}/
    \n ========================================`,
  );
});

const socketsControl = new SocketControl(httpServer);
socketsControl.principalConection();
APP.locals.io = socketsControl.getIo();
