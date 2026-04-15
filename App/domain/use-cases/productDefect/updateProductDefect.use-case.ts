import { DB, eq, UP } from "zormz";
import { generateTables } from "../../../BD-Control.js";
import { UpdateProductDefectDto } from "../../dto/productDefect/updateProductDefect.dto.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { UpdateParam } from "../../../consts.js";
import { getByIDProductDefect } from "./getByIdProductDefect.js";

export class UpdateProductDefectUseCase {
  async execute(datos: UpdateProductDefectDto) {
    const { productsdefect } = generateTables();

    const idValidate = await DB.Select([productsdefect.idproductdefect])
      .from(productsdefect())
      .where(eq(productsdefect.idproductdefect, datos.idProductDefect))
      .execute();

    if (idValidate.length === 0) {
      throw CustomError.badRequest("No existe este producto");
    }

    const updateData: UpdateParam[] = [];

    if (datos.nombre !== undefined) {
      updateData.push(UP(productsdefect.nombre, datos.nombre));
    }
    if (datos.descripcion !== undefined) {
      updateData.push(UP(productsdefect.descripcion, datos.descripcion));
    }

    if (updateData.length === 0) {
      throw CustomError.badRequest("No hay datos para actualizar");
    }

    const resultado = await DB.Update(productsdefect())
      .set(updateData)
      .where(eq(productsdefect.idproductdefect, datos.idProductDefect))
      .execute();
    if (resultado === undefined || resultado === false) {
      throw CustomError.badRequest("Ocurrio un error al actualizar los datos");
    }

    const productUpdate = await getByIDProductDefect(datos.idProductDefect);
    return productUpdate;
  }
}
