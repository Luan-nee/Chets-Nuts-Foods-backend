import { JWTadapter } from "../core/config/AccessToken.js";
import { roomsSocket } from "../types/global.js";
import { Authpayload } from "../types/index.js";

interface valorSocket {
  message: roomsSocket;
  codigo: number;
  tiempo: number;
  estado: boolean;
}

export async function validatorTokenSocket(
  token: string,
): Promise<valorSocket> {
  try {
    const decodeAuthpayload = (await JWTadapter.verifyToken({
      token,
    })) as Authpayload;
    const tiempoActual = Math.floor(Date.now() / 1000);
    if (!decodeAuthpayload.exp) {
      decodeAuthpayload.exp = 400;
    }
    const tiempo = decodeAuthpayload.exp - tiempoActual;

    if (decodeAuthpayload.rol === "ADMIN") {
      return {
        message: "ADMINS",
        codigo: 1,
        tiempo,
        estado: true,
      };
    }

    if (
      decodeAuthpayload.rol === "COLABORADOR" &&
      decodeAuthpayload.establecimiento !== undefined
    ) {
      return {
        message: "ESTABLECIMIENTO",
        codigo: decodeAuthpayload.establecimiento,
        tiempo,
        estado: true,
      };
    }

    if (decodeAuthpayload.rol === "CHOFER") {
      return {
        estado: true,
        message: "CHOFERES",
        codigo: 2,
        tiempo,
      };
    }

    return {
      message: "CLIENTES",
      estado: false,
      tiempo,
      codigo: 3,
    };
  } catch (error) {
    console.log(error);
    return {
      estado: false,
      message: "CLIENTES",
      tiempo: 1,
      codigo: 404,
    };
  }
}
