import { initBD } from "../core/config/conexion.js";

import { DB } from "zormz";
import { generateTables } from "../sql/definitionTables.js";
initBD();

async function resetTables() {
  const {
    pedidos,
    producto,
    colaborador,
    detallepedido,
    permisos,
    detallespermisos,
    usuarios,
  } = generateTables();

  
  await DB.Delete(pedidos()).execute();
  await DB.Delete(producto()).execute();
  await DB.Delete(colaborador()).execute();
  await DB.Delete(detallepedido()).execute();
  await DB.Delete(permisos()).execute();
  await DB.Delete(detallespermisos()).execute();
  await DB.Delete(usuarios()).execute();

  console.log("La base de datos se reseteo con exito");

}

await resetTables();
