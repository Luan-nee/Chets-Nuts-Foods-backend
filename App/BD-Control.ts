import { defineTable, int, money, timestamp, varchar } from "zormz";

export function generateTables() {
  return {
    establecimientos: defineTable("", {
      iddest: int().Pk().$(),
      nombreest: varchar(100).Required().$(),
      direccion: varchar(150).Required().$(),
      idresponsable: int().Required().$(),
      descripcion: varchar(200).$(),
    }),
    productos: defineTable("productos", {
      id: int().Pk().AutoIncrement().$(),
      idenvio: int().Required().$(),
      nombreproducto: varchar(150).Required().$(),
      peso: varchar(50).Required().$(),
      cantidadproducto: int().Required().$(),
      fechacreacion: timestamp().now().$(),
      fechaactualizado: timestamp().onUpdate().$(),
    }),
    usuarios: defineTable("usuarios", {
      iduser: int().Pk().$(),
      nombres: varchar(100).Required().$(),
      apellidomaterno: varchar(50).Required().$(),
      apellidopaterno: varchar(50).Required().$(),
      edad: int().Required().Default(18).$(),
      dniuser: varchar(10).Required().$(),
      rucuser: varchar(15).$(),
      cantenvios: int().Required().$(),
      fechacreado: timestamp().now().$(),
    }),
    envios: defineTable("envios", {
      idenvio: int().Pk().$(),
      idusuario: int().Required().$(),
      clave: varchar(10).Required().$(),
      montocobrado: money().required().$(),
      origen: varchar(50).$(),
      idorigenestablecimiento: int().Required().$(),
      destino: varchar(50).$(),
      direccionactual: varchar(100).$(),
      tiempoestimado: varchar(50).$(),
      fechaenviado: timestamp().now().$(),
      fechafinalizado: timestamp().$(),
      ultimaactualizacion: timestamp().$(),
    }),
    seguimientoenvios: defineTable("seguimientoenvios", {
      idseg: int().Pk().$(),
      idenvio: int().Required().$(),
      idcontrolestablecimiento: int().$(),
      idcontrolsunat: int().$(),
      latitud: varchar(50).$(),
      longitud: varchar(50).$(),
      direccion: varchar(70).$(),
      fecharegistro: timestamp().now().$(),
    }),
    vehiculosempresa: defineTable("vehiculosempresa", {}),
  };
}

/*
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
*/
