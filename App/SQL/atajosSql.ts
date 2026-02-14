import { DB } from "zormz";
import { generateTables } from "../BD-Control.js";
import { UsuarioDto } from "../domain/dto/usuarios/usuario.dto.js";
import { CreateAccesDto } from "../domain/dto/auth/createAcces.dto.js";
import { CustomError } from "../core/res/Custom.error.js";

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
