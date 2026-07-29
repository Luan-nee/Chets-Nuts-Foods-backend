import { AND, ANDD, COUNT, DB, eq, ORD, ORQ, ORQD } from "zormz";
import { CreateProductsDefectDto } from "../../dto/productDefect/createProductDefect.dto.js";
import { generateTables } from "../../../BD-Control.js";
import { CustomError } from "../../../core/res/Custom.error.js";
import { PageDataDto } from "../../query-params/pageData.dto.js";
import { paginationResponde } from "../../../core/core.js";
import { getByIDProductDefect } from "./getByIdProductDefect.js";
import { ProductoDataDto } from "../../query-params/productosDefect/productoData.dto.js";

export class CreateProductDefectUseCase {
  async create(producto: CreateProductsDefectDto, creatorAcceso: number) {
    const { productsdefect, accesos } = generateTables();
    console.log(producto);

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

    const insertColumns = [
      productsdefect.nombre,
      productsdefect.descripcion,
      productsdefect.creatoracceso,
    ];
    const insertValues = [producto.nombre, producto.descripcion, creatorAcceso];

    if (producto.calidad !== undefined) {
      insertColumns.push(productsdefect.calidadproductodefect);
      insertValues.push(producto.calidad);
    }

    if (producto.calibre !== undefined) {
      insertColumns.push(productsdefect.calibreproductdefect);
      insertValues.push(producto.calibre);
    }

    const id = await DB.Insert(productsdefect(), insertColumns)
      .Values(insertValues)
      .Returning(productsdefect.idproductdefect)
      .execute();

    if (id === undefined) {
      throw CustomError.internalServer("Error al crear el producto");
    }

    const productoNuevo = await getByIDProductDefect(id[0]);

    return productoNuevo;
  }

  async getAll(control: ProductoDataDto) {
    const { productsdefect } = generateTables();

    const condicion = [];

    if (control.calidad) {
      condicion.push(eq(productsdefect.calidadproductodefect, control.calidad));
    }

    if (control.calibre) {
      condicion.push(eq(productsdefect.calibreproductdefect, control.calibre));
    }

    const data = await DB.Select([
      productsdefect.idproductdefect,
      productsdefect.nombre,
      productsdefect.descripcion,
      productsdefect.fechacreation,
      productsdefect.calidadproductodefect,
      productsdefect.calibreproductdefect,
    ])
      .from(productsdefect())
      .where(condicion.length === 0 ? undefined : ANDD(condicion))
      .LIMIT(10)
      .OFFSET((control.page - 1) * 10)
      .execute();

    const [cantidad] = await DB.Select([
      COUNT(productsdefect.idproductdefect, "cantidad"),
    ])
      .from(productsdefect())
      .execute();

    const pagination: paginationResponde = {
      pagina_actual: control.page,
      datos_por_pagina: 10,
      total_data: Number(cantidad.cantidad),
      total_paginas: Math.trunc(Number(cantidad.cantidad) / 10) + 1,
    };

    return { data, pagination };
  }
}
