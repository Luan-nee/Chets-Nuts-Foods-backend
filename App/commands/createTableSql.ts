import { initBD } from "../core/config/conexion.js";

import { generateTable } from "zormz";
import { generateTables } from "../sql/definitionTables.js";
initBD();


async function generarTablas(){
  const {
    pedidos,
    producto,
    colaborador,
    detallepedido,
    permisos,
    detallespermisos,
    usuarios,
    categorias
  } = generateTables();

  await generateTable(pedidos(), pedidos.$columns);
  
  await generateTable(producto(), producto.$columns);
  
  await generateTable(colaborador(), colaborador.$columns);
  
  await generateTable(detallepedido(), detallepedido.$columns);
  
  await generateTable(permisos(), permisos.$columns);
  
  await generateTable(detallespermisos(), detallespermisos.$columns);
  
  await generateTable(usuarios(),usuarios.$columns);

  await generateTable(categorias(),categorias.$columns);

}

await generarTablas();