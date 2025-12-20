import { DB, eq } from "zormz";
import { t_productos } from "../../../../BD-Control.js";
import { UpdateProductDto } from "./updateProduct.dto.js";
import { NumericId } from "../../numericId-dto.js";
import { CustomError } from "../../../../core/res/Custom.error.js";

export class UpdateProducto {
  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    // Verificar que el producto existe
    const productoExistente = await DB.select([t_productos.id])
      .from(t_productos())
      .where(eq(t_productos.id, id))
      .execute();

    if (productoExistente.length < 1) {
      throw CustomError.badRequest(
        `No se encontro ningun producto con el ID: ${id}`
      );
    }

    // Construir objeto de actualización solo con campos definidos
    const updateData: any = {};
    if (updateProductDto.sku !== undefined && updateProductDto.sku !== null) {
      updateData.sku = updateProductDto.sku;
    }
    if (updateProductDto.nombre !== undefined && updateProductDto.nombre !== null) {
      updateData.nombre = updateProductDto.nombre;
    }
    if (updateProductDto.stock_actual !== undefined && updateProductDto.stock_actual !== null) {
      updateData.stock_actual = updateProductDto.stock_actual;
    }
    if (updateProductDto.stock_minimo !== undefined && updateProductDto.stock_minimo !== null) {
      updateData.stock_minimo = updateProductDto.stock_minimo;
    }
    if (updateProductDto.porcentaje_ganancia !== undefined && updateProductDto.porcentaje_ganancia !== null) {
      updateData.porcentaje_ganancia = updateProductDto.porcentaje_ganancia;
    }
    if (updateProductDto.precio_compra_proveedor !== undefined && updateProductDto.precio_compra_proveedor !== null) {
      updateData.precio_compra_proveedor = updateProductDto.precio_compra_proveedor;
    }
    if (updateProductDto.descripcion !== undefined && updateProductDto.descripcion !== null) {
      updateData.descripcion = updateProductDto.descripcion;
    }

    // Realizar la actualización
    await DB.update(t_productos())
      .set(updateData)
      .where(eq(t_productos.id, id))
      .execute();

    // Retornar el producto actualizado
    const productoActualizado = await DB.select([
      t_productos.id,
      t_productos.sku,
      t_productos.nombre,
      t_productos.stock_actual,
      t_productos.stock_minimo,
      t_productos.precio_compra_proveedor,
      t_productos.porcentaje_ganancia,
      t_productos.descripcion,
    ])
      .from(t_productos())
      .where(eq(t_productos.id, id))
      .execute();

    return productoActualizado[0];
  }

  async execute(id: NumericId, updateProductDto: UpdateProductDto) {
    const productoActualizado = await this.updateProduct(id.id, updateProductDto);
    return productoActualizado;
  }
}
