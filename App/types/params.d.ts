export type paramsEstado = "INICIO" | "EN CAMINO" | "FINALIZADO" | "CANCELADO";

export interface paramsDate {
  fechaInicio?: Date;
  fechaFinal?: Date;
  estado?: paramsEstado;
}
