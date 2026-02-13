import { DB, eq } from "zormz";
import { UsuarioDto } from "../../dto/usuarios/usuario.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";

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

    const [valorInsert] = (await DB.Insert(usuarios(), [
      usuarios.apellidomaterno,
      usuarios.apellidopaterno,
      usuarios.dniuser,
      usuarios.nombres,
      usuarios.numero,
      usuarios.rucuser,
    ])
      .Values(fields)
      .Returning(usuarios.iduser)
      .execute()) as number[];
    if (!valorInsert) {
      throw CustomError.badRequest("No se pudo Registrar al Usuario");
    }

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
}
