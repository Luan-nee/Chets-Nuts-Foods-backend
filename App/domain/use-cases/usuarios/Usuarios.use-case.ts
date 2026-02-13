import { DB, eq, UP } from "zormz";
import { UsuarioDto } from "../../dto/usuarios/usuario.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { InsertUser } from "../../../SQL/atajosSql.js";
import { UpdateUsuarioDto } from "../../dto/usuarios/UpdateUsuario.dto.js";
import { UpdateParam } from "../../../consts.js";

export class UsuariosUseCase {
  async create(userDto: UsuarioDto, idUser) {
    const { usuarios } = generateTables();

    const repeat = (await DB.Select([usuarios.nombres])
      .from(usuarios())
      .where(eq(usuarios.dniuser, userDto.dni))
      .execute()) as object[];

    if (repeat.length > 0) {
      throw CustomError.badRequest(
        "Este usuario ya esta registrado, no se puede volver a registrar",
      );
    }

    const fields = [
      userDto.apellidomaterno,
      userDto.apellidopaterno,
      userDto.dni,
      userDto.nombre,
      userDto.numero,
      userDto.ruc,
    ];

    const valorInsert = await InsertUser(userDto);

    const [user] = (await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
    ])
      .from(usuarios())
      .where(eq(usuarios.iduser, valorInsert))
      .execute()) as object[];

    return user;
  }

  async update(userUpt: UpdateUsuarioDto, idUser) {
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
      fields.push(UP(usuarios.edad, userUpt.edad));

    if (userUpt.nombre !== undefined)
      fields.push(UP(usuarios.nombres, userUpt.nombre));

    if (userUpt.ruc !== undefined)
      fields.push(UP(usuarios.rucuser, userUpt.ruc));

    if (userUpt.numero !== undefined)
      fields.push(UP(usuarios.numero, userUpt.numero));

    if (fields.length <= 0)
      throw CustomError.badRequest("No hay datos a actualizar");

    const updateUser = await DB.Update(usuarios())
      .set(fields)
      .where(eq(usuarios.iduser, userUpt.iduser))
      .execute();

    if (!updateUser) {
      throw CustomError.badRequest("No se pudo realizar la Actualizacion");
    }

    const [newUser] = (await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
    ])
      .from(usuarios())
      .where(eq(usuarios.iduser, userUpt.iduser))
      .execute()) as Object[];

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
    const user = await DB.Select([
      usuarios.iduser,
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
    ])
      .from(usuarios())
      .where(eq(usuarios.dniuser, dniUser))
      .execute();

    if (!user) {
      throw CustomError.badRequest(
        "Este usuario no esta registrado en el sistema",
      );
    }
  }
}
