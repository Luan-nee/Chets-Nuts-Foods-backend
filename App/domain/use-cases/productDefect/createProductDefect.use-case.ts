import { COUNT, DB, eq } from "zormz";
import { CreateProductsDefectDto } from "../../dto/productDefect/createProductDefect.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { PageDataDto } from "../../query-params/pageData.dto.js";
import { paginationResponde } from "../../../core/core.js";
import { getByIDProductDefect } from "./getByIdProductDefect.js";

export class CreateProductDefectUseCase {
  async create(producto: CreateProductsDefectDto, creatorAcceso: number) {
    const { productsdefect, accesos } = generateTables();

    const validator = await DB.Select([productsdefect.idproductdefect])
      .from(productsdefect())
      .where(eq(productsdefect.nombre, producto.nombre))
      .execute();

    if (validator.length >= 1) {
      throw CustomError.badRequest(
        `El producto ${producto.nombre} ya esta registrado`,
      );
    }

    const validatorAccess = await DB.Select([accesos.idacceso])
      .from(accesos())
      .where(eq(accesos.idacceso, creatorAcceso))
      .execute();

    if (validatorAccess.length === 0) {
      throw CustomError.badRequest(
        "Usuario desconocido no puede crear un producto",
      );
    }

    const id = await DB.Insert(productsdefect(), [
      productsdefect.nombre,
      productsdefect.descripcion,
      productsdefect.creatoracceso,
    ])
      .Values([producto.nombre, producto.descripcion, creatorAcceso])
      .Returning(productsdefect.idproductdefect)
      .execute();

    if (id === undefined) {
      throw CustomError.internalServer("Error al crear el producto");
    }

    const productoNuevo = await getByIDProductDefect(id[0]);

    return productoNuevo;
  }

  async getAll(pagina: PageDataDto) {
    const { productsdefect } = generateTables();

    const data = await DB.Select([
      productsdefect.idproductdefect,
      productsdefect.nombre,
      productsdefect.descripcion,
      productsdefect.fechacreation,
    ])
      .from(productsdefect())
      .LIMIT(10)
      .OFFSET(pagina.page * 10)
      .execute();

    const [cantidad] = await DB.Select([
      COUNT(productsdefect.idproductdefect, "cantidad"),
    ])
      .from(productsdefect())
      .execute();

    const pagination: paginationResponde = {
      pagina_actual: pagina.page,
      datos_por_pagina: 10,
      total_data: Number(cantidad.cantidad),
      total_paginas: Math.trunc(Number(cantidad.cantidad) / 10),
    };

    return { data, pagination };
  }
}
