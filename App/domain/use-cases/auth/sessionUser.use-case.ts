import { AND, DB, eq } from "zormz";
import { JWTadapter } from "../../../core/config/AccessToken.js";
import { LoginUserDto } from "../../dto/auth/loginUser.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { generateTables } from "../../../BD-Control.js";

interface IdReponse {
  idacceso: number;
  tipos: string;
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
    const { accesos } = generateTables();
    const resutado = (await DB.Select([accesos.tipos, accesos.idacceso])
      .from(accesos())
      .where(
        AND(
          eq(accesos.correo, data.usuario),
          eq(accesos.contra, data.password),
        ),
      )
      .execute(true)) as IdReponse[];

    console.log(resutado);

    if (!resutado) {
      throw CustomError.badRequest("Usuario o contra Incorrectas");
    }

    if (resutado.length <= 0) {
      throw CustomError.badRequest("Usuario o Contra Incorrectas");
    }

    const tokenZ = this.generarToken({ id: resutado[0].idacceso });
    return { tipos: resutado[0].tipos, tokenZ };
  }
}
