import { AND, COUNT, DB, eq, OR, ORD, UP } from "zormz";
import { CreateAccesDto } from "../../dto/auth/createAcces.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { CreateAccesos, InsertUser } from "../../../SQL/atajosSql.js";
import { UpdateAccesDto } from "../../dto/auth/UpdateAccess.dto.js";
import { roles, UpdateParam } from "../../../consts.js";
import { UsuarioDto } from "../../dto/usuarios/usuario.dto.js";
import { PageDataDto } from "../../query-params/pageData.dto.js";
import { paginationResponde } from "../../../core/core.js";

interface accesoRepeat {
  correo: string;
  estado: boolean;
}

interface validateUsers {
  nombres: string;
  correo: string;
  numeroLicenciaConducir: string;
  numero: string;
  rucuser: string;
}

export class CreateAccesoUseCase {
  async createExec(user: UsuarioDto, accesosDto: CreateAccesDto) {
    const { correo, password, tipos } = accesosDto;

    const { accesos, usuarios } = generateTables();

    const iduserCase = await InsertUser(user);

    const validUser = (await DB.Select([
      usuarios.nombres,
      usuarios.correo,
      usuarios.numeroLicenciaConducir,
      usuarios.numero,
      usuarios.rucuser,
      usuarios.dniuser,
    ])
      .from(usuarios())
      .where(eq(usuarios.iduser, iduserCase))
      .execute()) as validateUsers[] | undefined;

    if (validUser === undefined || validUser.length === 0) {
      throw CustomError.badRequest(
        `El usuario con el ID : ${iduserCase} no existe`,
      );
    }

    const validAccesoRepeat = (await DB.Select([accesos.correo, accesos.estado])
      .from(accesos())
      .where(OR(eq(accesos.correo, correo), eq(accesos.idusuario, iduserCase)))
      .execute()) as accesoRepeat[] | undefined;

    if (validAccesoRepeat !== undefined && validAccesoRepeat.length > 0) {
      throw CustomError.badRequest(
        "Este usuario con el DNI ya esta en uso para un acceso",
      );
    }

    if (
      validAccesoRepeat !== undefined &&
      validAccesoRepeat.length === 1 &&
      !validAccesoRepeat[0].estado
    ) {
      throw CustomError.badRequest("Este usuario existe pero esta inabilitado");
    }

    if (
      (validUser[0].rucuser === undefined || validUser[0].rucuser === null) &&
      tipos === "CHOFER"
    ) {
      throw CustomError.badRequest(
        "Para registrar un colaborador este debe tener un ruc",
      );
    }

    if (
      tipos === "CHOFER" &&
      validUser[0].numeroLicenciaConducir === undefined
    ) {
      throw CustomError.badRequest(
        "Para dar el rol de CHOFER este tiene que tener licencia de Conducir",
      );
    }

    const idAcceso = await CreateAccesos({
      correo,
      idusuario: iduserCase,
      password,
      tipos,
    });

    return "ok";
  }

  async getAll(page: PageDataDto) {
    const { accesos, usuarios } = generateTables();

    console.log(page);

    const dataAccess = await DB.Select([
      accesos.idacceso,
      accesos.correo,
      accesos.estado,
      accesos.tipos,
      accesos.estadoacceso,
      usuarios.dniuser,
      usuarios.nombres,
    ])
      .from(accesos())
      .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser, false))
      .where()
      .LIMIT(10)
      .OFFSET((page.page - 1) * 10)
      .execute(true);

    if (dataAccess === undefined) {
      throw CustomError.badRequest("Ocurrio un error al realizar la consulta");
    }

    const [busqueda] = await DB.Select([COUNT(accesos.idacceso, "cantidad")])
      .from(accesos())
      .execute();

    //paginationResponde;

    const paginas: paginationResponde = {
      total_data: Number(busqueda.cantidad),
      datos_por_pagina: 10,
      pagina_actual: page.page,
      total_paginas: Math.trunc(Number(busqueda.cantidad) / 10) + 1,
    };
    return { data: dataAccess, paginasResponse: paginas };
  }

  async update(update: UpdateAccesDto) {
    const { accesos } = generateTables();
    const query: UpdateParam[] = [];

    if (update.correo !== undefined) {
      query.push(UP(accesos.correo, update.correo));
    }

    if (update.estado !== undefined) {
      query.push(UP(accesos.estado, `${update.estado}`, true));
    }

    if (update.password !== undefined) {
      query.push(UP(accesos.contra, update.password));
    }

    if (update.tipos !== undefined) {
      query.push(UP(accesos.tipos, update.tipos));
    }

    if (query.length == 0) {
      throw CustomError.badRequest("No hay datos para actualizar");
    }

    const response = await DB.Update(accesos())
      .set(query)
      .where(eq(accesos.idacceso, update.idacceso))
      .execute();

    if (!response) {
      throw CustomError.badRequest("Ocurrio un error al momento de actualizar");
    }
    return "ok";
  }

  async getByID(id: number) {
    const { accesos, usuarios } = generateTables();
    let mensaje = "consulta exitosa";
    const dataAccess = await DB.Select([
      accesos.idacceso,
      accesos.correo,
      accesos.estado,
      accesos.tipos,
      accesos.idusuario,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.rucuser,
      usuarios.numero,
      usuarios.correo,
      usuarios.edad,
      accesos.contra,
      accesos.fechaCreacion,
    ])
      .from(accesos())
      .innerJOIN(usuarios(), eq(accesos.idusuario, usuarios.iduser, false))
      .where(eq(accesos.idacceso, id))
      .execute(true);

    if (dataAccess === undefined) {
      throw CustomError.internalServer(
        "Ocurrio un error al realizar la consulta",
      );
    }

    if (dataAccess.length === 0) {
      mensaje = `No existe este usuario con el ID ${id} en el sistema`;
    }

    return { data: dataAccess[0], mensaje };
  }

  async getRoles() {
    console.log(roles);
    return roles;
  }
}
