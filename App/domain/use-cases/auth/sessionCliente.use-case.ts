import { DB, eq } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { JWTadapter } from "../../../core/config/AccessToken.js";
import { convertNumeros } from "../../../services/convertLetras.js";
import { Authpayload } from "../../../types/index.js";
import { ClientLoginDTO } from "../../dto/auth/clientLogin.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { estadoPaquete } from "../../../types/global.js";

interface paqueteType {
  idenvio: number;
  estadopaquete: estadoPaquete;
  destino: string;
  clave: string;
  idusuario: number;
  nombres: string;
  iduser: number;
  dniuser: string;
}

export default class SessionClienteUseCase {
  private generarToken(input: Authpayload) {
    const token = JWTadapter.createAccessToken({
      payload: input,
      duration: 900,
    });
    return token;
  }

  async sessionCliente(data: ClientLoginDTO) {
    const { paquetes, usuarios } = generateTables();

    const id = convertNumeros(data.sala);

    console.log(id);

    const dataPaquete = (await DB.Select([
      paquetes.idenvio,
      paquetes.estadopaquete,
      paquetes.destino,
      paquetes.clave,
      paquetes.idusuario,
      usuarios.iduser,
      usuarios.nombres,
      usuarios.dniuser,
    ])
      .from(paquetes())
      .innerJOIN(usuarios(), eq(paquetes.idusuario, usuarios.iduser, false))
      .where(eq(paquetes.idenvio, id))
      .execute()) as paqueteType[];
    console.log(dataPaquete);

    if (dataPaquete.length === 0) {
      throw CustomError.badRequest(
        "CLAVE or DNI invalid, please try again in 2m",
      );
    }

    const paqueteControl = dataPaquete[0];

    if (paqueteControl.dniuser !== data.dni) {
      throw CustomError.badRequest("Incorrect DNI for the room");
    }

    if (paqueteControl.clave !== data.clave) {
      throw CustomError.badRequest("Incorrect CLAVE to access the room");
    }

    if (paqueteControl.estadopaquete === "ENTREGADO") {
      throw CustomError.badRequest("This package has already been delivered");
    }

    const token = this.generarToken({
      id: paqueteControl.idenvio,
      rol: "CLIENTE",
    });

    return {
      tokenZ: token,
      nombreUser: paqueteControl.nombres,
      rol: "CLIENTE",
    };
  }
}
