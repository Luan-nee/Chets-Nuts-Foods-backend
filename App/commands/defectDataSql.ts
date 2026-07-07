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
    nombre: "zain",
    apellidomaterno: "viamonte",
    apellidopaterno: "vilca",
    dni: "75276127",
    numero: "925543023",
    edad: 21,
    sexo: "MASCULINO",
  });

  const idAcceso1 = await CreateAccesos({
    correo: "correoprueba@gmail.com",
    password: "ybanacceso",
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
