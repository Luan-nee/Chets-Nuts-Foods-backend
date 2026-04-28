import { AND, DB, eq } from "zormz";
import { JWTadapter } from "../../../core/config/AccessToken.js";
import { LoginUserDto } from "../../dto/auth/loginUser.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { generateTables } from "../../../BD-Control.js";
import { Authpayload } from "../../../types/index.js";
import { tipeUser } from "../../../types/global.js";

interface IdReponse {
  idacceso: number;
  tipos: tipeUser;
  idusuario: number;
  estado: boolean;
}

interface idEstablecimiento {
  idEst: number;
}

export default class SessionUserUseCase {
  private generarToken(input: Authpayload, duration?: number) {
    const token = JWTadapter.createAccessToken({
      payload: input,
      duration,
    });

    return token;
  }

  async sessionUser(data: LoginUserDto) {
    const { accesos, usuarios, datosempresa, establecimientos } =
      generateTables();
    const resutado = (await DB.Select([
      accesos.tipos,
      accesos.idacceso,
      accesos.idusuario,
      accesos.estado,
    ])
      .from(accesos())
      .where(
        AND(
          eq(accesos.correo, data.usuario),
          eq(accesos.contra, data.password),
        ),
      )
      .execute()) as IdReponse[];

    if (resutado.length <= 0) {
      throw CustomError.badRequest("Usuario o Contra Incorrectas");
    }

    if (!resutado[0].estado) {
      throw CustomError.badRequest("Esta cuenta esta desabilitado");
    }

    const tokenBefore: Authpayload = {
      id: resutado[0].idacceso,
      rol: resutado[0].tipos,
    };

    if (resutado[0].tipos === "COLABORADOR") {
      const establecimiento = (await DB.Select([establecimientos.idEst])
        .from(establecimientos())
        .where(eq(establecimientos.idEst, resutado[0].idacceso))
        .execute(true)) as idEstablecimiento[];

      console.log(establecimiento);

      if (establecimiento.length !== 0) {
        tokenBefore.establecimiento = establecimiento[0].idEst;
      }
    }

    const [user] = (await DB.Select([usuarios.nombres])
      .from(usuarios())
      .where(eq(usuarios.iduser, resutado[0].idusuario))
      .execute()) as { nombres: string }[];

    const dataEmpresa = await DB.Select([datosempresa.idDatosEmpresa])
      .from(datosempresa())
      .execute();

    console.log(dataEmpresa);
    let mensajeAlert = "LOGEADO CON EXITO !!";
    if (dataEmpresa?.length == 0) {
      mensajeAlert =
        "INICIASTE SESION PERO AUN EL SISTEMA NO FUNCIONARA, PRIMERO REGISTRAR LOS DATOS DE LA EMPRESA";
    }

    const tokenZ = this.generarToken(tokenBefore);
    return {
      rol: resutado[0].tipos,
      tokenZ,
      nombreUser: user.nombres,
      mensajeAlert,
    };
  }
}
