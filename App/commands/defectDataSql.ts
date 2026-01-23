import { initBD } from "../core/config/conexion.js";

import { DB } from "zormz";
import { generateTables } from "../sql/definitionTables.js";
import { PermisosPrincipal } from "../consts.js";
import {
  createCategoria,
  createProducts,
  InsertarUsuario,
} from "../sql/atajosSql.js";
initBD();

async function generarTablas() {
  const {
    pedidos,
    producto,
    colaborador,
    detallepedido,
    permisos,
    detallespermisos,
    usuarios,
  } = generateTables();

  let permisosLoad = Object.entries(PermisosPrincipal);
  await DB.Insert(permisos(), [permisos.nombre, permisos.descripcion])
    .Values(permisosLoad)
    .execute();

  await InsertarUsuario({
    nombrecompleto: "zainmaster123",
    correo: "zviamontevilca@gmail.com",
    contra: "zainmaster123",
    dni: "75276127",
    rol: "administrador",
    diastrabajo: ["lunes", "martes"],
  });

  await InsertarUsuario({
    nombrecompleto: "yukio",
    correo: "zviamontev21@gmail.com",
    contra: "zainmaster123",
    dni: "75276127",
    rol: "apoyo",
    diastrabajo: ["lunes", "martes"],
  });

  await InsertarUsuario({
    nombrecompleto: "apoyo",
    correo: "apoyo@gmail.com",
    contra: "zainmaster123",
    dni: "75276124",
    rol: "apoyo",
    diastrabajo: ["lunes", "martes"],
  });

  await InsertarUsuario({
    nombrecompleto: "operativo",
    correo: "operativo@gmail.com",
    contra: "zainmaster123",
    dni: "75276126",
    rol: "operativo",
    diastrabajo: ["lunes", "martes", "miercoles"],
  });

  const categoria = await createCategoria({
    nombrecategoria: "helados1",
    descripcion: "Los helados mas frescos",
  });

  await createProducts({
    nombrecomercial: "helado1",
    descripcion: "este es una helado",
    idcategoria: categoria,
    preciocompra: 12,
    precioventa: 15,
    stockactual: 10,
    stockminimo: 5,
  });

  await createProducts({
    nombrecomercial: "helado2",
    descripcion: "este es una helado",
    idcategoria: categoria,
    preciocompra: 12,
    precioventa: 15,
    stockactual: 10,
    stockminimo: 5,
  });
  await createProducts({
    nombrecomercial: "helado3",
    descripcion: "este es una helado",
    idcategoria: categoria,
    preciocompra: 12,
    precioventa: 15,
    stockactual: 10,
    stockminimo: 5,
  });

  await createProducts({
    nombrecomercial: "helado4",
    descripcion: "este es una helado",
    idcategoria: categoria,
    preciocompra: 12,
    precioventa: 15,
    stockactual: 10,
    stockminimo: 5,
  });
}

await generarTablas();
