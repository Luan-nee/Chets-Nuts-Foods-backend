import { defineTable } from "zormz";

export const t_productos = defineTable("t_productos", {
  id: "id",
  sku: "sku",
  nombre: "nombre",
  stock_actual: "stock_actual",
  stock_minimo: "stock_minimo",
  porcentaje_ganancia: "porcentaje_ganancia",
  precio_compra_proveedor: "precio_compra_proveedor",
  descripcion: "descripcion",
  id_usuario_admin: "id_usuario_admin",
});
