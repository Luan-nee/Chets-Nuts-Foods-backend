import { AND, DB, eq } from "zormz";
import { JWTadapter } from "../../../core/config/AccessToken.js";
import { LoginUserDto } from "../../dto/auth/loginUser.dto.js";
import { usuarios_admin } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";

interface ResId {
  id: Number;
}

export default class SessionUserUseCase {
  private generarToken(input: Record<string, any>, duration?: number) {
    const token = JWTadapter.createAccessToken({
      payload: input,
      duration,
    });

    return token;
  }

  async sessionUser(data: LoginUserDto) {
    const resutado: ResId[] = await DB.select([usuarios_admin.id])
      .from(usuarios_admin())
      .where(
        AND(
          eq(usuarios_admin.correo, data.usuario),
          eq(usuarios_admin.contrasenia, data.password)
        )
      )
      .execute();

    console.log(resutado);
    if (!resutado) {
      throw CustomError.badRequest("Usuario o contra Incorrectas");
    }

    if (resutado.length > 1) {
      throw CustomError.badRequest("Error de usuarios");
    }

    if (resutado.length < 1) {
      throw CustomError.badRequest("Usuario o Contra Incorrectas");
    }

    const tokenZ = this.generarToken(resutado[0]);
    return { tokenZ };
  }
}
