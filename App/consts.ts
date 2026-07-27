import { UP } from "zormz";
import { SchedulerTask } from "./services/schedulerTask.js";
import NodeCache from "node-cache";

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
export const roles = [
  { id: 1, rol: "ADMIN" },
  { id: 2, rol: "CHOFER" },
  { id: 3, rol: "CLIENTE" },
  { id: 4, rol: "COLABORADOR" },
];
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

export const pagePermises: string[] = [
  "http://localhost:5173",
  "https://chets-nuts-foods-frontend.vercel.app",
  "https://chets-nuts-foods-frontend.vercel.app/",
];

export const cacheEnvioUsuario = new Map<number, number[]>();

export const usuariosConectados = new Map<number, Set<string>>();

export const schedulerTask = new SchedulerTask();

export const datosInicio = {
  ultimaRevision: "29-06-2026 12:00:00",
  saltoHoras: 1,
};

export const cacheGlobal = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
});

export const CacheKeys = {
  dataEmpresa: "datosEmpresa",
  informacionEmpresa: "infoEmpresa",
  USUARIOSUNAT: "usuario",
};

export const CACHE_TTL = {
  MINUTE: 60,
  FIVE_MINUTES: 60 * 5,
  TEN_MINUTES: 60 * 10,
  THIRTY_MINUTES: 60 * 30,
  HOUR: 60 * 60,
  DAY: 60 * 60 * 24,
  WEEK: 60 * 60 * 24 * 7,
} as const;
