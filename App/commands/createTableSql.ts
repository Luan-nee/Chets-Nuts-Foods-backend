import { generateTable } from "zormz";
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

  await generateTable(accesos(), accesos.$columns);
  await generateTable(establecimientos(), establecimientos.$columns);
  await generateTable(guiasremision(), guiasremision.$columns);
  await generateTable(paquetes(), paquetes.$columns);
  await generateTable(productos(), productos.$columns);
  await generateTable(seguimientopaquetes(), seguimientopaquetes.$columns);
  await generateTable(usuarios(), usuarios.$columns);
  await generateTable(vehiculosempresa(), vehiculosempresa.$columns);
}

await generarTablas();
