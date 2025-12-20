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

export const usuarios_admin = defineTable("usuarios_admin", {
  id: "id",
  nombres: "nombres",
  apellidos: "apellidos",
  dni: "dni",
  ruc: "ruc",
  tipo_domicilio: "tipo_domicilio",
  ubigeo: "ubigeo",
  direccion_detallada: "direccion_detallada",
  correo: "correo",
  contrasenia: "contrasenia",
});
