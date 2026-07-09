import http from "http";
import APP from "./app.js";
import { env } from "process";
import SocketControl from "./socketsControl.js";
import { initBD } from "../database/conexion.js";
import cron from "node-cron";
import { startTasks, tareasPendientes } from "./tasks/taskAlertas.js";

initBD();
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

tareasPendientes(socketsControl.getIo());

cron.schedule("0 */1 * * *", () => {
  startTasks(socketsControl.getIo());
});
