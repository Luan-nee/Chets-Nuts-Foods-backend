import { initBD } from "../../database/conexion.js";
import {
  CreateAccesos,
  CreateEstablecimiento,
  createVehiculoEmpresa,
  InsertUser,
} from "../SQL/atajosSql.js";

initBD();

async function generarTablas() {
  const idR = await InsertUser({
    nombre: "FREDI JUAN",
    apellidomaterno: "AGUILAR",
    apellidopaterno: "ASTETE",
    dni: "45687841",
    numero: "962239581",
    edad: 21,
    sexo: "MASCULINO",
  });

  const idAcceso1 = await CreateAccesos({
    correo: "admin@gmail.com",
    password: "admin",
    tipos: "ADMIN",
    idusuario: idR,
  });
}

await generarTablas()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
