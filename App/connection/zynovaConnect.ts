import { envs } from "../core/config/envs.js";

interface telefonos {
  numeroCelular: string;
}

interface correos {
  correo: string;
}

interface registerUser {
  nombre: string;
  apellido: string;
  dni: string;
  direccion?: string;
  ruc?: string;
  telefono: telefonos[];
  sexo: "MASCULINO" | "FEMENINO";
  correos: correos[];
}

export class ZynovaConnect {
  private static async emitConsulta(
    url: string,
    methodo: "POST" | "GET",
    body?: any,
  ) {
    const urlOrigin = "https://server.zynova.online";
    const { CONNECT_ZYNOVA } = envs;
    const response = await fetch(urlOrigin + url, {
      method: methodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${CONNECT_ZYNOVA}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  }

  static async registrarUser(datos: registerUser) {
    await ZynovaConnect.emitConsulta("/userMaster/api/register", "POST", datos)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static async getUser(doc: string) {
    const resultado = await ZynovaConnect.emitConsulta(
      `/userMaster/api/${doc}`,
      "GET",
    )
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }
}
