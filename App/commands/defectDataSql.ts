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
    "castaña con cáscara",
    "Castaña en estado natural con cáscara",
  );
  await CreateProductosDefecto(
    "castaña pelada",
    "Castaña sin cáscara lista para procesamiento",
  );
  await CreateProductosDefecto(
    "castaña seleccionada",
    "Castaña clasificada por tamaño y calidad",
  );
  await CreateProductosDefecto(
    "castaña seca",
    "Castaña deshidratada para comercialización",
  );
  await CreateProductosDefecto(
    "castaña tostada",
    "Castaña tostada para consumo",
  );
  await CreateProductosDefecto(
    "castaña envasada",
    "Castaña empacada para distribución",
  );
  await CreateProductosDefecto(
    "castaña orgánica",
    "Castaña certificada de producción orgánica",
  );
  await CreateProductosDefecto(
    "castaña a granel",
    "Castaña transportada en sacos o big bags",
  );
  await CreateProductosDefecto(
    "almendra de castaña",
    "Semilla de castaña sin cáscara",
  );
  await CreateProductosDefecto(
    "harina de castaña",
    "Harina obtenida del procesamiento de la castaña",
  );
  await CreateProductosDefecto(
    "aceite de castaña",
    "Aceite extraído de la almendra de castaña",
  );
  await CreateProductosDefecto(
    "subproductos de castaña",
    "Residuos y derivados del procesamiento de castaña",
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
