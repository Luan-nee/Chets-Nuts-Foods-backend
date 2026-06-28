import { connecionLocal, connecionRed, getConexion } from "zormz";
import { envs } from "../App/core/config/envs.js";

const { DB_DATABASE, CONNECT_PG, DB_HOST, DB_PASS, DB_PORT, DB_USER, DB_TIPO } =
  envs;

export async function initBD() {
  const conexion: connecionLocal = {
    database: DB_DATABASE,
    host: DB_HOST,
    password: DB_PASS,
    port: DB_PORT,
    user: DB_USER,
  };
  const conexionRed: connecionRed = {
    connectionString: CONNECT_PG,
  };
  if (CONNECT_PG !== "null") {
    await getConexion(DB_TIPO, conexionRed);
    return;
  }
  await getConexion(DB_TIPO, conexion);
}
