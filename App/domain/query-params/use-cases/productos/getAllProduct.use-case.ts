import { AND, DB, ILIKE, MAYOR, OR } from "zormz";
import { maxPageSize, orderValues } from "../../../../consts.js";
import { QueriesProductoDto } from "../../../../presentation/entities/productos/queriesDtoProductos.js";
import { t_productos } from "../../../../BD-Control.js";

export class GetAllProductos {
  private readonly selectFields = [
    t_productos.id,
    t_productos.sku,
    t_productos.nombre,
    t_productos.stock_actual,
    t_productos.stock_minimo,
    t_productos.precio_compra_proveedor,
    t_productos.porcentaje_ganancia,
    t_productos.descripcion,
  ];

  private async getProductos(queriesDto: QueriesProductoDto | undefined) {
    const order = queriesDto.order === orderValues.asc ? "ASC" : "DESC";
    const busquedaCondicion =
      queriesDto.search.length > 2
        ? OR(
            ILIKE(t_productos.nombre, `%${queriesDto.search}%`),
            ILIKE(t_productos.descripcion, `%${queriesDto.search}%`)
          )
        : undefined;
    const condition = AND(
      MAYOR(t_productos.id, `${queriesDto.page * maxPageSize}`),
      busquedaCondicion
    );
    const productos = await DB.select(this.selectFields)
      .from(t_productos())
      .OrderBy({ id: order })
      .where(busquedaCondicion)
      .LIMIT(maxPageSize)
      .execute();
    return productos;
  }

  async execute(queriesDto: QueriesProductoDto) {
    const productos = await this.getProductos(queriesDto);
    return productos;
  }
  async execute1() {
    console.log(this.selectFields);
    const productos = await DB.select(this.selectFields)
      .from(t_productos())
      .execute();

    return productos;
  }
}
