import { DB, eq, UP } from "zormz";
import { UsuarioDto } from "../../dto/usuarios/usuario.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { InsertUser } from "../../../SQL/atajosSql.js";
import { UpdateUsuarioDto } from "../../dto/usuarios/UpdateUsuario.dto.js";
import { UpdateParam } from "../../../consts.js";

interface validateUserDuplicate {
  iduser: number;
  rucuser: string | null;
  dniuser: string | null;
  numeroLicenciaConducir: string | null;
}

export class UsuariosUseCase {
  private async getUserByID(id: number) {
    const { usuarios } = generateTables();
    const [user] = (await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
      usuarios.tipo,
    ])
      .from(usuarios())
      .where(eq(usuarios.iduser, id))
      .execute()) as Object[];
    return user;
  }

  async create(userDto: UsuarioDto) {
    const { usuarios } = generateTables();

    if (userDto.dni === undefined && userDto.ruc === undefined) {
      throw CustomError.badRequest(
        "Para agregar al usuario se tiene que ingresar el ruc o dni",
      );
    }

    const comparacion = eq(
      usuarios.dniuser,
      userDto.dni !== undefined
        ? userDto.dni
        : userDto.ruc !== undefined
          ? userDto.ruc
          : "",
    );

    const repeat = (await DB.Select([
      usuarios.iduser,
      usuarios.rucuser,
      usuarios.dniuser,
      usuarios.numeroLicenciaConducir,
    ])
      .from(usuarios())
      .where(comparacion)
      .execute()) as validateUserDuplicate[];

    if (repeat.length > 0) {
      const queryExec: UpdateParam[] = [];
      if (repeat[0].dniuser == null && userDto.dni !== undefined) {
        queryExec.push(UP(usuarios.dniuser, userDto.dni));
      }

      if (repeat[0].rucuser == null && userDto.ruc !== undefined) {
        queryExec.push(UP(usuarios.rucuser, userDto.ruc));
      }

      if (
        repeat[0].numeroLicenciaConducir == null &&
        userDto.numeroLicenciaConducir !== undefined
      ) {
        queryExec.push(
          UP(usuarios.numeroLicenciaConducir, userDto.numeroLicenciaConducir),
        );
      }
      if (queryExec.length == 0) {
        throw CustomError.badRequest(
          "Este usuario ya esta registrado, no se puede volver a registrar",
        );
      }
      const updateUser = await DB.Update(usuarios())
        .set(queryExec)
        .where(eq(usuarios.iduser, repeat[0].iduser))
        .execute();
      const user = this.getUserByID(repeat[0].iduser);
      return user;
    }
    const valorInsert = await InsertUser(userDto);
    const user = this.getUserByID(valorInsert);
    return user;
  }

  async update(userUpt: UpdateUsuarioDto, idUser: number) {
    const { usuarios } = generateTables();
    const existUser = await DB.Select([usuarios.iduser, usuarios.dniuser])
      .from(usuarios())
      .where(eq(usuarios.iduser, userUpt.iduser))
      .execute();

    if (!existUser) {
      throw CustomError.badRequest(
        "Este usuario no Existe para la Actualizacion",
      );
    }

    const fields: UpdateParam[] = [];

    if (userUpt.apellidomaterno !== undefined) {
      fields.push(UP(usuarios.apellidomaterno, userUpt.apellidomaterno));
    }

    if (userUpt.apellidopaterno !== undefined)
      fields.push(UP(usuarios.apellidopaterno, userUpt.apellidopaterno));

    if (userUpt.edad !== undefined)
      fields.push(UP(usuarios.edad, `${userUpt.edad}`));

    if (userUpt.nombre !== undefined)
      fields.push(UP(usuarios.nombres, userUpt.nombre));

    if (userUpt.ruc !== undefined)
      fields.push(UP(usuarios.rucuser, userUpt.ruc));

    if (userUpt.numero !== undefined)
      fields.push(UP(usuarios.numero, userUpt.numero));

    if (userUpt.dni !== undefined) {
      fields.push(UP(usuarios.dniuser, userUpt.dni));
    }

    if (userUpt.tipo !== undefined) {
      fields.push(UP(usuarios.tipo, userUpt.tipo));
    }

    if (fields.length <= 0)
      throw CustomError.badRequest("No hay datos a actualizar");

    const updateUser = await DB.Update(usuarios())
      .set(fields)
      .where(eq(usuarios.iduser, userUpt.iduser))
      .execute();

    if (!updateUser) {
      throw CustomError.badRequest("No se pudo realizar la Actualizacion");
    }

    const newUser = this.getUserByID(userUpt.iduser);

    return newUser;
  }

  async getAll(idUser: number) {
    const { usuarios } = generateTables();
    const users = (await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
    ])
      .from(usuarios())
      .LIMIT(15)
      .execute()) as Object[];

    if (!users) {
      throw CustomError.badRequest(
        "Error al momnento de optener los  usuarios",
      );
    }

    if (users.length <= 0) {
      throw CustomError.badRequest("Error al momento de obtener los usuarios");
    }

    return users;
  }

  async GetByDni(dniUser: string, idUser: number) {
    const { usuarios } = generateTables();
    const [user] = (await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
      usuarios.tipo,
      usuarios.edad,
      usuarios.numeroLicenciaConducir,
      usuarios.cantenvios,
    ])
      .from(usuarios())
      .where(eq(usuarios.dniuser, dniUser))
      .execute()) as object[];

    if (!user) {
      throw CustomError.badRequest(
        "Este usuario no esta registrado en el sistema",
      );
    }
    return user;
  }

  async GetByRuc(rucUser: string, idUser: number) {
    const { usuarios } = generateTables();
    const [user] = (await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
      usuarios.tipo,
      usuarios.edad,
      usuarios.numeroLicenciaConducir,
      usuarios.cantenvios,
    ])
      .from(usuarios())
      .where(eq(usuarios.rucuser, rucUser))
      .execute()) as object[];

    if (!user) {
      throw CustomError.badRequest(
        "Este usuario no esta registrado en el sistema",
      );
    }
    return user;
  }
}
