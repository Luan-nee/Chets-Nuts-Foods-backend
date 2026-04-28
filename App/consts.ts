import { UP } from "zormz";

export const ResponseStatus = {
  success: "success",
  fail: "fail",
  error: "error",
  z: "z",
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

export const maxPageSize = 10;

export const defaultQueries = {
  search: "",
  sort_by: "",
  order: orderValues.desc,
  page: 0,
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

export type EstadosTipoEstablecimiento =
  | "fiscal"
  | "anexo"
  | "almacen"
  | "oficina"
  | "no_registrado";

export const MTCdata = "123456-2024-MTC/17";

export const departamentosPeru = [
  "AMAZONAS",
  "ANCASH",
  "APURIMAC",
  "AREQUIPA",
  "AYACUCHO",
  "CAJAMARCA",
  "CALLAO",
  "CUSCO",
  "HUANCAVELICA",
  "HUANUCO",
  "ICA",
  "JUNIN",
  "LA LIBERTAD",
  "LAMBAYEQUE",
  "LIMA",
  "LORETO",
  "MADRE DE DIOS",
  "MOQUEGUA",
  "PASCO",
  "PIURA",
  "PUNO",
  "SAN MARTIN",
  "TACNA",
  "TUMBES",
  "UCAYALI",
] as const;

export type departamentosPeruType = (typeof departamentosPeru)[number];

export const pagePermises: string[] = ["http://localhost:5173"];

export const cacheEnvioUsuario = new Map<number, number[]>();

export const usuariosConectados = new Map<number, Set<string>>();
