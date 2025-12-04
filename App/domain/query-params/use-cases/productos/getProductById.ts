import { DB, eq } from "zormz";
import { t_productos } from "../../../../BD-Control.js";
import { NumericId } from "../../numericId-dto.js";
import { CustomError } from "../../../../core/res/Custom.error.js";

export class GetProductByID {
  private readonly selectFields = [
    t_productos.id,
    t_productos.sku,
    t_productos.nombre,
    t_productos.stock_actual,
    t_productos.stock_minimo,
    t_productos.precio_compra_proveedor,
    t_productos.porcentaje_ganancia,
    t_productos.descripcion,
    t_productos.id_usuario_admin,
  ];

  async getById(id: number) {
    const producto = await DB.select(this.selectFields)
      .from(t_productos())
      .where(eq(t_productos.id, id))
      .execute();

    if (producto.length < 1) {
      throw CustomError.badRequest(
        `No se encontro ningun producto con el ID :  ${id}`
      );
    }
    return producto;
  }

  async execute(param: NumericId) {
    const producto = await this.getById(param.id);
    return producto;
  }
}
