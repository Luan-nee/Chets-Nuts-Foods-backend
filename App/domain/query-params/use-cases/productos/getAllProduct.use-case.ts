import { DB, ILIKE, OR } from "zormz";
import { maxPageSize, orderValues } from "../../../../consts.js";
import { QueriesProductoDto } from "../../../../presentation/entities/productos/queriesDtoProductos.js";

export class GetAllProductos {
  private readonly selectFields = [
    "id",
    "sku",
    "nombre",
    "stock_actual",
    "stock_minimo",
    "precio_compra_proveedor",
    "porcentaje_ganancia",
    "descripcion",
  ];

  private async getProductos(queriesDto: QueriesProductoDto) {
    const order = queriesDto.order === orderValues.asc ? "ASC" : "DESC";

    const busquedaCondicion =
      queriesDto.search.length > 2
        ? OR(
            ILIKE("nombre", `%${queriesDto.search}%`),
            ILIKE("descripcion", `%${queriesDto.search}%`)
          )
        : undefined;

    const productos = await DB.select(this.selectFields)
      .from("t_productos")
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
}
