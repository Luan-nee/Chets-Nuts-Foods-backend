import { initBD } from "../../database/conexion.js";
import { generateTables } from "../BD-Control.js";

initBD();

async function generarTablas() {
  const {
    accesos,
    establecimientos,
    guiasremision,
    paquetes,
    productos,
    seguimientopaquetes,
    usuarios,
    vehiculosempresa,
  } = generateTables();
}

await generarTablas();
