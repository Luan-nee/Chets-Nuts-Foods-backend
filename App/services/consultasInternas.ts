import { DB } from "zormz";
import { UpdateParam } from "../consts.js";

export class ConsultasInternas {
  static async Update(
    tabla: string,
    condicional: string,
    setDatas: UpdateParam[],
  ) {
    await DB.Update(tabla)
      .set(setDatas)
      .where(condicional)
      .execute()
      .then((response) => {
        console.log(`Actualizacion de ${tabla} correctamente ${response}`);
      });
  }
}
