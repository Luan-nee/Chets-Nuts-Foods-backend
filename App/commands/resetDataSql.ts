import { DB } from "zormz";
import { initBD } from "../../database/conexion.js";
import { generateTables } from "../BD-Control.js";
initBD();

async function resetTables() {
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

  await DB.Delete(accesos()).execute();
  await DB.Delete(establecimientos()).execute();
  await DB.Delete(guiasremision()).execute();
  await DB.Delete(paquetes()).execute();
  await DB.Delete(productos()).execute();
  await DB.Delete(seguimientopaquetes()).execute();
  await DB.Delete(usuarios()).execute();
  await DB.Delete(vehiculosempresa()).execute();
  console.log("La base de datos se reseteo con exito");
}

await resetTables();
