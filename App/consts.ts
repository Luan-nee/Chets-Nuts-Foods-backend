import { UP } from "zormz";

export const ResponseStatus = {
  success: "success",
  fail: "fail",
  error: "error",
} as const;

export const orderValues = {
  asc: "asc",
  desc: "desc",
} as const;

export const filterTypeValues = {
  eq: "eq",
  gt: "gt",
  lt: "lt",
  after: "after",
  before: "before",
} as const;

export const maxPageSize = 100;

export const defaultQueries = {
  search: "",
  sort_by: "",
  order: orderValues.desc,
  page: 1,
  page_size: 30,
  filter: "",
  filter_value: undefined,
  filter_type: filterTypeValues.eq,
};

export type UpdateParam = ReturnType<typeof UP>;

export const permisosPrincipal = {
  createUser: "Creacion de un usuario",
  createColaborador: "Creacion de colaborador",
  createVehiculo: "Creacion de un vehiculo",
  updatePaquetes: "Actualizar estado de los paquetes o middificarlos",
} as const;

export type PermisoValor = keyof typeof permisosPrincipal;

export const permisosAdministrador: PermisoValor[] = [
  "createColaborador",
  "createUser",
  "createVehiculo",
  "updatePaquetes",
];
