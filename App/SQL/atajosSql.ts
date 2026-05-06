import { DB, eq, UP } from "zormz";
import { generateTables } from "../BD-Control.js";
import { UsuarioDto } from "../domain/dto/usuarios/usuario.dto.js";
import { CreateAccesDto } from "../domain/dto/auth/createAcces.dto.js";
import { CustomError } from "../core/res/Custom.error.js";
import { CreateCarroDto } from "../domain/dto/autosEmpresa/createCarro.dto.js";
import { CreateEstablecimientoDto } from "../domain/dto/establecimientos/createEstablecimiento.dto.js";
import { ZynovaConnect } from "../connection/zynovaConnect.js";
import { UpdateParam } from "../consts.js";

interface insertarUser {
  iduser: number;
  nombres: string;
  apellidopaterno: string;
}

export async function InsertUser({
  nombre,
  apellidomaterno,
  apellidopaterno,
  edad,
  dni,
  ruc,
  numero,
  tipo,
  numeroLicenciaConducir,
  sexo,
  correo,
}: UsuarioDto) {
  const { usuarios } = generateTables();

  const fields: (string | number)[] = [
    nombre.toUpperCase(),
    apellidomaterno.toUpperCase(),
    apellidopaterno.toUpperCase(),
    dni,
  ];
  const valores = [
    usuarios.nombres,
    usuarios.apellidomaterno,
    usuarios.apellidopaterno,
    usuarios.dniuser,
  ];

  const query: UpdateParam[] = [];

  if (dni === undefined && ruc === undefined) {
    throw CustomError.badRequest("RUC O DNI PARA REGISTRAR AL USUARIO");
  }

  if (numero !== undefined) {
    fields.push(numero);
    valores.push(usuarios.numero);
    query.push(UP(usuarios.numero, numero));
  }

  if (ruc !== undefined) {
    fields.push(ruc);
    valores.push(usuarios.rucuser);
    query.push(UP(usuarios.rucuser, ruc));
  }

  if (tipo !== undefined) {
    fields.push(tipo);
    valores.push(usuarios.tipo);
    query.push(UP(usuarios.tipo, tipo));
  }

  if (edad !== null && edad !== undefined) {
    fields.push(edad);
    valores.push(usuarios.edad);
    query.push(UP(usuarios.edad, `${edad}`));
  }

  if (numeroLicenciaConducir !== undefined) {
    fields.push(numeroLicenciaConducir);
    valores.push(usuarios.numeroLicenciaConducir);
    query.push(UP(usuarios.numeroLicenciaConducir, numeroLicenciaConducir));
  }

  if (correo !== undefined) {
    fields.push(correo);
    valores.push(usuarios.correo);
    query.push(UP(usuarios.correo, correo));
  }

  if (
    edad !== undefined &&
    dni !== undefined &&
    correo !== undefined &&
    numero !== undefined
  ) {
    ZynovaConnect.registrarUser({
      nombre: nombre,
      apellido: apellidopaterno + " " + apellidomaterno,
      correos: [{ correo: correo }],
      dni: dni,
      sexo: sexo,
      telefono: [{ numeroCelular: numero }],
    });
  }

  const existUser = (await DB.Select([
    usuarios.iduser,
    usuarios.nombres,
    usuarios.apellidopaterno,
  ])
    .from(usuarios())
    .where(eq(usuarios.dniuser, dni))
    .execute()) as insertarUser[] | undefined;

  if (existUser === undefined || existUser.length === 0) {
    const [id] = (await DB.Insert(usuarios(), valores)
      .Values(fields)
      .Returning(usuarios.iduser)
      .execute()) as number[];

    console.log(`Usuario ${nombre} Creado con exito `);
    return id;
  } else {
    const upt = await DB.Update(usuarios())
      .set(query)
      .where(eq(usuarios.iduser, existUser[0].iduser))
      .execute();
    return existUser[0].iduser;
  }
}

export async function CreateAccesos({
  correo,
  password,
  tipos,
  idusuario,
}: CreateAccesDto) {
  const { accesos } = generateTables();

  if (idusuario === undefined) {
    throw CustomError.badRequest("El id User es obligatorio");
  }

  const idAccedo = (await DB.Insert(accesos(), [
    accesos.correo,
    accesos.contra,
    accesos.tipos,
    accesos.idusuario,
  ])
    .Values([correo, password, tipos, idusuario])
    .Returning(accesos.idacceso)
    .execute()) as number[];

  console.log(idAccedo);

  if (!idAccedo)
    throw CustomError.badRequest("Ocurrio un Error al crear el acceso");

  if (idAccedo.length <= 0) {
    throw CustomError.badRequest("No se pudo crear");
  }
  console.log(`Acceso creado con exito para ${correo}`);
  return idAccedo[0];
}

export async function createVehiculoEmpresa({
  anio,
  capacidadCarga,
  marca,
  modelo,
  placa,
  tipoVehiculo,
  numeroHabilitacion,
  tipo,
  vin,
}: CreateCarroDto) {
  const { vehiculosempresa } = generateTables();

  const query = [
    vehiculosempresa.anio,
    vehiculosempresa.capacidadCarga,
    vehiculosempresa.marca,
    vehiculosempresa.modelo,
    vehiculosempresa.placa,
    vehiculosempresa.tipoVehiculo,
  ];
  const valores: any[] = [
    anio,
    capacidadCarga,
    marca,
    modelo,
    placa,
    tipoVehiculo,
  ];

  if (numeroHabilitacion !== undefined) {
    query.push(vehiculosempresa.numeroHabilitacion);
    valores.push(numeroHabilitacion);
  }

  if (tipo !== undefined) {
    query.push(vehiculosempresa.tiposervicio);
    valores.push(tipo);
  }

  if (vin !== undefined) {
    query.push(vehiculosempresa.vin);
    valores.push(vin);
  }

  const [id] = (await DB.Insert(vehiculosempresa(), query)
    .Values(valores)
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
  codigoSunat,
  ubigeo,
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

  if (verifi.length > 0) {
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
    ubigeo,
  ];

  const querys = [
    establecimientos.idUsuarioResponsable,
    establecimientos.nombreEst,
    establecimientos.descripcion,
    establecimientos.direccion,
    establecimientos.latitud,
    establecimientos.longitud,
    establecimientos.provincia,
    establecimientos.departamento,
    establecimientos.distrito,
    establecimientos.ubigeo,
  ];

  if (tipoEstado !== undefined) {
    campos.push(tipoEstado);
    querys.push(establecimientos.tipoestablecimiento);
  }

  if (codigoSunat !== undefined) {
    campos.push(codigoSunat);
    querys.push(establecimientos.codigoSunat);
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
