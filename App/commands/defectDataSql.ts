import { initBD } from "../../database/conexion.js";
import { CreateAccesos, InsertUser } from "../SQL/atajosSql.js";

initBD();

async function generarTablas() {
  const idR = await InsertUser({
    nombre: "zain",
    apellidomaterno: "viamonte",
    apellidopaterno: "vilca",
    dni: "75276127",
    numero: "925543023",
    edad: 20,
  });

  const id2 = await InsertUser({
    nombre: "YUKIO",
    apellidomaterno: "QUISPE",
    apellidopaterno: "ROJAS",
    dni: "75276126",
    numero: "925543023",
  });

  const id3 = await InsertUser({
    nombre: "LUAN DEL SOL",
    apellidomaterno: "HUILLCA",
    apellidopaterno: "SANCHEZ",
    dni: "75276128",
  });

  const idAcceso1 = await CreateAccesos({
    usuario: "zviamontevilca@gmail.com",
    password: "zainmaster123",
    tipos: "ADMIN",
    idUser: idR,
  });

  const idAcceso2 = await CreateAccesos({
    usuario: "luandelsol@gmail.com",
    password: "luan123",
    tipos: "COLABORADOR",
    idUser: id3,
  });
}

await generarTablas();
