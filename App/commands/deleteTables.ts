import { dropTable } from "zormz";

import { initBD } from "../../database/conexion.js";
import { generateTables } from "../BD-Control.js";
initBD();

async function deleteTables() {
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
  await dropTable(accesos());
  await dropTable(establecimientos());
  await dropTable(guiasremision());
  await dropTable(paquetes());
  await dropTable(productos());
  await dropTable(seguimientopaquetes());
  await dropTable(usuarios());
  await dropTable(vehiculosempresa());
}

await deleteTables();
