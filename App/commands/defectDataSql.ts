import { initBD } from "../../database/conexion.js";
import {
  CreateAccesos,
  CreateProductosDefecto,
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

  await CreateProductosDefecto(
    "castaña pelada",
    "Castaña sin cáscara lista para procesamiento",
    "PRIMERA",
    "GRANDE",
  );

  await CreateProductosDefecto(
    "castaña pelada",
    "Castaña sin cáscara lista para procesamiento",
    "PRIMERA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "castaña pelada",
    "Castaña sin cáscara lista para procesamiento",
    "SEGUNDA",
    "GRANDE",
  );

  await CreateProductosDefecto(
    "castaña pelada",
    "Castaña sin cáscara lista para procesamiento",
    "SEGUNDA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "castaña con cáscara",
    "Castaña en estado natural con cáscara",
    "PRIMERA",
    "GRANDE",
  );

  await CreateProductosDefecto(
    "castaña con cáscara",
    "Castaña en estado natural con cáscara",
    "PRIMERA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "castaña con cáscara",
    "Castaña en estado natural con cáscara",
    "SEGUNDA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "castaña con cáscara",
    "Castaña en estado natural con cáscara",
    "TERCERA",
    "ENANO",
  );

  await CreateProductosDefecto(
    "almendra de castaña",
    "Almendra de castaña seleccionada para exportación",
    "PRIMERA",
    "GRANDE",
  );

  await CreateProductosDefecto(
    "almendra de castaña",
    "Almendra de castaña seleccionada para exportación",
    "PRIMERA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "almendra de castaña",
    "Almendra de castaña seleccionada para industria",
    "SEGUNDA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "castaña orgánica",
    "Castaña certificada de producción orgánica",
    "PRIMERA",
    "GRANDE",
  );

  await CreateProductosDefecto(
    "castaña orgánica",
    "Castaña certificada de producción orgánica",
    "PRIMERA",
    "MEDIANO",
  );

  await CreateProductosDefecto(
    "castaña seleccionada",
    "Castaña clasificada por tamaño y calidad",
    "SEGUNDA",
    "ENANO",
  );

  await CreateProductosDefecto(
    "castaña industrial",
    "Castaña destinada para transformación industrial",
    "TERCERA",
    "TINY",
  );
}

await generarTablas()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
