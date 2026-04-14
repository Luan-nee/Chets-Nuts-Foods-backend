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
    datosempresa,
    salidatransporte,
    productsdefect,
  } = generateTables();

  await generateTable(accesos(), accesos.$columns);
  await generateTable(establecimientos(), establecimientos.$columns);
  await generateTable(productos(), productos.$columns);
  await generateTable(usuarios(), usuarios.$columns);
  await generateTable(guiasremision(), guiasremision.$columns);
  await generateTable(paquetes(), paquetes.$columns);
  await generateTable(seguimientopaquetes(), seguimientopaquetes.$columns);
  await generateTable(vehiculosempresa(), vehiculosempresa.$columns);
  await generateTable(datosempresa(), datosempresa.$columns);
  await generateTable(salidatransporte(), salidatransporte.$columns);
  await generateTable(productsdefect(), productsdefect.$columns);
}

await generarTablas()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
