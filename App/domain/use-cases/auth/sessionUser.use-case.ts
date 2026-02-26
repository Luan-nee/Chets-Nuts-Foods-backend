import { AND, DB, eq } from "zormz";
import { JWTadapter } from "../../../core/config/AccessToken.js";
import { LoginUserDto } from "../../dto/auth/loginUser.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { generateTables } from "../../../BD-Control.js";

interface IdReponse {
  idacceso: number;
  tipos: string;
  idusuario: number;
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
    const { accesos, usuarios, datosempresa } = generateTables();
    const resutado = (await DB.Select([
      accesos.tipos,
      accesos.idacceso,
      accesos.idusuario,
    ])
      .from(accesos())
      .where(
        AND(
          eq(accesos.correo, data.usuario),
          eq(accesos.contra, data.password),
        ),
      )
      .execute()) as IdReponse[];

    if (!resutado) {
      throw CustomError.badRequest("Usuario o contra Incorrectas");
    }

    if (resutado.length <= 0) {
      throw CustomError.badRequest("Usuario o Contra Incorrectas");
    }

    const [user] = (await DB.Select([usuarios.nombres])
      .from(usuarios())
      .where(eq(usuarios.iduser, resutado[0].idusuario))
      .execute()) as { nombres: string }[];

    const dataEmpresa = await DB.Select([datosempresa.idDatosEmpresa])
      .from(datosempresa())
      .execute();

    console.log(dataEmpresa);
    let mensajeAlert = "";
    if (dataEmpresa?.length == 0) {
      mensajeAlert =
        "INICIASTE SESION PERO AUN EL SISTEMA NO FUNCIONARA, PRIMERO REGISTRAR LOS DATOS DE LA EMPRESA";
    }

    const tokenZ = this.generarToken({
      id: resutado[0].idacceso,
      rol: resutado[0].tipos,
    });
    return {
      rol: resutado[0].tipos,
      tokenZ,
      nombreUser: user.nombres,
      mensajeAlert,
    };
  }
}
