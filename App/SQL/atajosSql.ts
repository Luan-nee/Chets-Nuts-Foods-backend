import { DB, eq } from "zormz";
import { generateTables } from "../BD-Control.js";
import { UsuarioDto } from "../domain/dto/usuarios/usuario.dto.js";
import { CreateAccesDto } from "../domain/dto/auth/createAcces.dto.js";
import { CustomError } from "../core/res/Custom.error.js";
import { CreateCarroDto } from "../domain/dto/autosEmpresa/createCarro.dto.js";
import { CreateEstablecimientoDto } from "../domain/dto/establecimientos/createEstablecimiento.dto.js";

export async function InsertUser({
  nombre,
  apellidomaterno,
  apellidopaterno,
  edad,
  dni,
  ruc,
  numero,
  tipo,
}: UsuarioDto) {
  const { usuarios } = generateTables();

  const fields: (string | number)[] = [
    nombre.toUpperCase(),
    apellidomaterno.toUpperCase(),
    apellidopaterno.toUpperCase(),
    dni,
    numero,
    ruc,
    tipo,
  ];
  const valores = [
    usuarios.nombres,
    usuarios.apellidomaterno,
    usuarios.apellidopaterno,
  ];
  if (dni === undefined && ruc === undefined) {
    throw CustomError.badRequest("RUC O DNI PARA REGISTRAR AL USUARIO");
  }

  if (numero !== undefined) {
    fields.push(numero);
    valores.push(usuarios.numero);
  }

  if (ruc !== undefined) {
    fields.push(ruc);
    valores.push(usuarios.rucuser);
  }

  if (dni !== undefined) {
    fields.push(dni);
    valores.push(usuarios.dniuser);
  }

  if (tipo !== undefined) {
    fields.push(tipo);
    valores.push(usuarios.tipo);
  }

  if (edad !== undefined) {
    fields.push(edad);
    valores.push(usuarios.edad);
  }

  const [id] = (await DB.Insert(usuarios(), valores)
    .Values(fields)
    .Returning(usuarios.iduser)
    .execute()) as number[];

  console.log(`Usuario ${nombre} Creado con exito `);
  return id;
}

export async function CreateAccesos({
  usuario,
  password,
  tipos,
  idUser,
}: CreateAccesDto) {
  const { accesos } = generateTables();

  const idAccedo = (await DB.Insert(accesos(), [
    accesos.correo,
    accesos.contra,
    accesos.tipos,
    accesos.idusuario,
  ])
    .Values([usuario, password, tipos, idUser])
    .Returning(accesos.idacceso)
    .execute()) as number[];

  if (!idAccedo)
    throw CustomError.badRequest("Ocurrio un Error al crear el acceso");

  if (idAccedo.length <= 0) {
    throw CustomError.badRequest("No se pudo crear");
  }
  console.log(`Acceso creado con exito para ${usuario}`);
  return idAccedo[0];
}

export async function createVehiculoEmpresa({
  anio,
  capacidadCarga,
  marca,
  modelo,
  placa,
  tipoVehiculo,
}: CreateCarroDto) {
  const { vehiculosempresa } = generateTables();

  const verifiVehiculo = (await DB.Select([vehiculosempresa.idvehempresa])
    .from(vehiculosempresa())
    .where(eq(vehiculosempresa.placa, placa))
    .execute()) as object[];

  if (verifiVehiculo || verifiVehiculo.length > 0) {
    throw CustomError.badRequest(
      `Este vehiculo con la placa ${placa} ya esta registrado.`,
    );
  }

  const [id] = (await DB.Insert(vehiculosempresa(), [
    vehiculosempresa.anio,
    vehiculosempresa.capacidadCarga,
    vehiculosempresa.marca,
    vehiculosempresa.modelo,
    vehiculosempresa.placa,
    vehiculosempresa.tipoVehiculo,
  ])
    .Values([anio, capacidadCarga, marca, modelo, placa, tipoVehiculo])
    .Returning(vehiculosempresa.idvehempresa)
    .execute()) as number[];

  if (!id) {
    throw CustomError.badRequest("Error al momento de crear el vehiculo");
  }

  return id;
}

export async function CreateEstablecimiento({
  departamento,
  descripcion,
  direccion,
  distrito,
  idResponsable,
  latitud,
  longitud,
  nombreEstablecimiento,
  provincia,
  tipoEstado,
}: CreateEstablecimientoDto) {
  const { establecimientos } = generateTables();
  const verifi = (await DB.Select([
    establecimientos.nombreEst,
    establecimientos.fechaCreacion,
    establecimientos.direccion,
  ])
    .from(establecimientos())
    .where(eq(establecimientos.nombreEst, nombreEstablecimiento))
    .execute()) as {
    nombreEst: string;
    fechaCreacion: string;
    direccion: string;
  }[];

  if (verifi || verifi.length > 0) {
    throw CustomError.badRequest(
      `El establecimiento ${nombreEstablecimiento} Ya esta registrado y se encuentra en la direccion : ${verifi[0].direccion} y fue creado el ${verifi[0].fechaCreacion}`,
    );
  }

  const campos = [
    idResponsable,
    nombreEstablecimiento,
    descripcion,
    direccion,
    latitud,
    longitud,
    provincia,
    departamento,
    distrito,
  ];

  const querys = [
    establecimientos.idResponsable,
    establecimientos.nombreEst,
    establecimientos.descripcion,
    establecimientos.direccion,
    establecimientos.latitud,
    establecimientos.longitud,
    establecimientos.provincia,
    establecimientos.departamento,
    establecimientos.distrito,
  ];

  if (tipoEstado !== undefined) {
    campos.push(tipoEstado);
    querys.push(establecimientos.tipoEst);
  }

  const [id] = (await DB.Insert(establecimientos(), querys)
    .Values(campos)
    .Returning(establecimientos.idEst)
    .execute()) as number[];

  if (!id) {
    throw CustomError.badRequest(
      "Ocurrio un Error al momento de registrar el Establecimiento",
    );
  }
  return id;
}
