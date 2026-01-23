import { dropTable } from "zormz";
import { initBD } from "../core/config/conexion.js";

import { generateTables } from "../sql/definitionTables.js";
initBD();

async function deleteTables() {
  const  {
    pedidos,
    producto,
    colaborador,
    detallepedido,
    permisos,
    detallespermisos,
    usuarios,
    categorias
  } = generateTables();

  await dropTable(pedidos());
  await dropTable(producto())
  await dropTable(colaborador())
  await dropTable(detallepedido())
  await dropTable(permisos())
  await dropTable(detallespermisos())
  await dropTable(usuarios())
  await dropTable(categorias())
}

await deleteTables();
