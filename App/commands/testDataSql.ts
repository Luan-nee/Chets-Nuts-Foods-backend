import { initBD } from "../../database/conexion.js";
import { envs } from "../core/config/envs.js";
import {
  CreateAccesos,
  CreateDatosEmpresa,
  CreateEstablecimiento,
  CreateProductosDefecto,
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
    numeroLicenciaConducir: "Q174689994",
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

  const idAcceso5 = await CreateAccesos({
    correo: "luisvalga1973@gmail.com",
    password: "user123",
    tipos: "COLABORADOR",
    idusuario: id7,
  });

  const idAcceso6 = await CreateAccesos({
    correo: "mullunicruziyumi@gmail.com",
    password: "user123",
    tipos: "COLABORADOR",
    idusuario: id6,
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
    tipos: "CHOFER",
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
    idResponsable: id3,
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
    idResponsable: id5,
    latitud: "111500",
    longitud: "1200",
    nombreEstablecimiento: "Prueba 3",
    tipoEstado: "oficina",
    ubigeo: "170101",
  });

  await CreateProductosDefecto("castaña", "Producto de castaña");
  await CreateProductosDefecto("nuez", "Producto de nuez");
  await CreateProductosDefecto("almendra", "Producto de almendra");
  await CreateProductosDefecto("maní", "Producto de maní");
  await CreateProductosDefecto("pistacho", "Producto de pistacho");
  await CreateProductosDefecto("avellana", "Producto de avellana");
  await CreateProductosDefecto("pecana", "Producto de pecana");
  await CreateProductosDefecto("macadamia", "Producto de macadamia");
  await CreateProductosDefecto("pasa", "Producto de pasa");
  await CreateProductosDefecto(
    "arándano deshidratado",
    "Producto de arándano deshidratado",
  );
  await CreateProductosDefecto("uva pasa", "Producto de uva pasa");
  await CreateProductosDefecto("higo seco", "Producto de higo seco");
  await CreateProductosDefecto("ciruela seca", "Producto de ciruela seca");
  await CreateProductosDefecto(
    "orejón de durazno",
    "Producto de orejón de durazno",
  );
  await CreateProductosDefecto(
    "orejón de manzana",
    "Producto de orejón de manzana",
  );
  await CreateProductosDefecto("coco rallado", "Producto de coco rallado");
  await CreateProductosDefecto("quinua", "Producto de quinua");
  await CreateProductosDefecto("kiwicha", "Producto de kiwicha");
  await CreateProductosDefecto("cañihua", "Producto de cañihua");
  await CreateProductosDefecto("chía", "Producto de chía");
  await CreateProductosDefecto("linaza", "Producto de linaza");
  await CreateProductosDefecto("ajonjolí", "Producto de ajonjolí");
  await CreateProductosDefecto("cacao en grano", "Producto de cacao en grano");
  await CreateProductosDefecto("cacao en polvo", "Producto de cacao en polvo");
  await CreateProductosDefecto(
    "chocolate bitter",
    "Producto de chocolate bitter",
  );
  await CreateProductosDefecto(
    "chocolate con leche",
    "Producto de chocolate con leche",
  );
  await CreateProductosDefecto("miel de abeja", "Producto de miel de abeja");
  await CreateProductosDefecto("panela", "Producto de panela");
  await CreateProductosDefecto("azúcar rubia", "Producto de azúcar rubia");
  await CreateProductosDefecto("café tostado", "Producto de café tostado");
  await CreateProductosDefecto("café molido", "Producto de café molido");
  await CreateProductosDefecto("té verde", "Producto de té verde");
  await CreateProductosDefecto("té negro", "Producto de té negro");
  await CreateProductosDefecto(
    "infusión de manzanilla",
    "Producto de infusión de manzanilla",
  );
  await CreateProductosDefecto("orégano seco", "Producto de orégano seco");
  await CreateProductosDefecto("romero seco", "Producto de romero seco");
  await CreateProductosDefecto("tomillo seco", "Producto de tomillo seco");
  await CreateProductosDefecto("pimienta negra", "Producto de pimienta negra");
  await CreateProductosDefecto("canela en rama", "Producto de canela en rama");
  await CreateProductosDefecto("clavo de olor", "Producto de clavo de olor");
  await CreateProductosDefecto("comino", "Producto de comino");
  await CreateProductosDefecto(
    "palomitas de maíz",
    "Producto de palomitas de maíz",
  );
  await CreateProductosDefecto("maíz morado", "Producto de maíz morado");
  await CreateProductosDefecto("maíz chulpe", "Producto de maíz chulpe");
  await CreateProductosDefecto("garbanzo", "Producto de garbanzo");
  await CreateProductosDefecto("lenteja", "Producto de lenteja");
  await CreateProductosDefecto("frejol canario", "Producto de frejol canario");
  await CreateProductosDefecto("frejol negro", "Producto de frejol negro");
  await CreateProductosDefecto("arroz integral", "Producto de arroz integral");
  await CreateProductosDefecto(
    "avena en hojuelas",
    "Producto de avena en hojuelas",
  );
}

await generateDataDefect()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
