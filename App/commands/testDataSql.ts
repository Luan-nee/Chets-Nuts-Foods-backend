import { initBD } from "../../database/conexion.js";
import { envs } from "../core/config/envs.js";
import {
  CreateAccesos,
  CreateDatosEmpresa,
  CreateEstablecimiento,
  createVehiculoEmpresa,
  InsertUser,
} from "../SQL/atajosSql.js";

initBD();

async function generateDataDefect() {
  const { APIPASS } = envs;
  const dataEmpresa = await CreateDatosEmpresa({
    ruc: "10752761278",
    denominacion: "SAA de transporte Z",
    numeroRegistroMtc: "123456789",
    correo: "zviamontevilca@gmail.com",
    codigoMtc: "12345678",
    urlApi: "https://sandbox.apisunat.pe/api/v3/dispatches", //campo no obligatorios
    claveAcceso: APIPASS, //campo no obligatorio , solo cuando quieres emitir factura
    tipo: "TEST",
    fechaVigenciaRegistroMtc: new Date("2027-12-12"),
  });

  const id3 = await InsertUser({
    nombre: "MICHAEL DEYVIS ",
    apellidomaterno: "MAMANI",
    apellidopaterno: "CHOQQUE",
    dni: "74689994",
    edad: 23,
    sexo: "MASCULINO",
    ruc: "10746899940",
    correo: "dmamanic@unamad.edu.pe",
    numeroLicenciaConducir: "111-GR3",
  });

  const id4 = await InsertUser({
    nombre: "JOSE ALESSANDRO",
    apellidomaterno: "SONCCO",
    apellidopaterno: "HUILLCA",
    dni: "76731904",
    edad: 23,
    sexo: "MASCULINO",
    correo: "23121018@unamad.edu.pe",
    numero: "943393214",
    numeroLicenciaConducir: "111-GR4",
  });

  const id5 = await InsertUser({
    nombre: "DAFNEY KAORI",
    apellidomaterno: "MIYASHIRO",
    apellidopaterno: "KOGA",
    dni: "75276128",
    edad: 23,
    sexo: "MASCULINO",
    correo: "23121036@unamad.edu.pe",
    numeroLicenciaConducir: "111-GR5",
  });

  const id6 = await InsertUser({
    nombre: "Iyumi",
    apellidomaterno: "Mulluni",
    apellidopaterno: "Cruz",
    dni: "72962348",
    edad: 22,
    sexo: "MASCULINO",
    correo: "mullunicruziyumi@gmail.com",
    numeroLicenciaConducir: "111-GR6",
  });

  const id7 = await InsertUser({
    nombre: "LUIA FRANCISCO",
    apellidomaterno: "VALDIVIA",
    apellidopaterno: "GAMARRA",
    dni: "04963068",
    edad: 40,
    sexo: "MASCULINO",
    correo: "luisvalga1973@gmail.com",
    numeroLicenciaConducir: "111-GR5",
  });

  const idAcceso2 = await CreateAccesos({
    correo: "23121018@unamad.edu.pe",
    password: "user123",
    tipos: "COLABORADOR",
    idusuario: id3,
  });

  const idAcceso3 = await CreateAccesos({
    correo: "23121018@unamad.edu.pe",
    password: "chofer123",
    tipos: "CHOFER",
    idusuario: id3,
  });

  const idAcceso4 = await CreateAccesos({
    correo: "23121018@unamad.edu.pe",
    password: "chofer123",
    tipos: "CLIENTE",
    idusuario: id3,
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
    idResponsable: id4,
    latitud: "111500",
    longitud: "1200",
    nombreEstablecimiento: "Prueba 1",
    tipoEstado: "oficina",
    ubigeo: "170101",
  });

  const establecimiento2 = await CreateEstablecimiento({
    departamento: "MADRE DE DIOS",
    descripcion: "Establecimiento de prueba1",
    direccion: "av. Alameda",
    distrito: "TAMBOPATA",
    provincia: "TAMBOPATA",
    idResponsable: id4,
    latitud: "111500",
    longitud: "1200",
    nombreEstablecimiento: "Prueba 2",
    tipoEstado: "oficina",
    ubigeo: "170101",
  });

  const establecimiento3 = await CreateEstablecimiento({
    departamento: "MADRE DE DIOS",
    descripcion: "Establecimiento de prueba2",
    direccion: "av. Ernesto rivero",
    distrito: "TAMBOPATA",
    provincia: "TAMBOPATA",
    idResponsable: id4,
    latitud: "111500",
    longitud: "1200",
    nombreEstablecimiento: "Prueba 3",
    tipoEstado: "oficina",
    ubigeo: "170101",
  });
}

await generateDataDefect()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
