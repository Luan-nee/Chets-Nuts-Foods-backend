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

  const idAcceso3 = await CreateAccesos({
    usuario: "luandelsol@gmail.com",
    password: "chofer123",
    tipos: "CHOFER",
    idUser: id3,
  });

  const carro1 = await createVehiculoEmpresa({
    anio: "2012",
    capacidadCarga: 20,
    marca: "TOYOTA",
    modelo: "EX1",
    placa: "BBC-1TO",
    tipoVehiculo: "4*4",
  });

  const carro2 = await createVehiculoEmpresa({
    anio: "2017",
    capacidadCarga: 980,
    marca: "KOSS",
    modelo: "EX1",
    placa: "BBC-1TU",
    tipoVehiculo: "ban",
  });

  const establecimiento1 = await CreateEstablecimiento({
    departamento: "MADRE DE DIOS",
    descripcion: "Establecimiento de prueba",
    direccion: "av. madre de dios con fiscarrald",
    distrito: "TAMBOPATA",
    provincia: "TAMBOPATA",
    idResponsable: idR,
    latitud: "111500",
    longitud: "1200",
    nombreEstablecimiento: "Prueba 1",
    tipoEstado: "oficina",
  });

  const establecimiento2 = await CreateEstablecimiento({
    departamento: "MADRE DE DIOS",
    descripcion: "Establecimiento de prueba",
    direccion: "av. madre de dios con fiscarrald",
    distrito: "TAMBOPATA",
    provincia: "TAMBOPATA",
    idResponsable: id3,
    latitud: "111500",
    longitud: "1200",
    nombreEstablecimiento: "Prueba 2",
    tipoEstado: "almacen",
  });
}

await generarTablas();
