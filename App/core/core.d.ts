import { Response } from "express";
import { ResponseStatus } from "../consts";

export type ResponseStatusType =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];

export interface paginationResponde {
  total_data: number;
  total_paginas: number;
  pagina_actual: number;
  datos_por_pagina: number;
}

export interface SendResponseArgs {
  res: Response;
  message?: string;
  data?: any;
  status: ResponseStatusType;
  statusCode?: number;
  error?: any;
  authorization?: string;
  pagination?: paginationResponde;
}

export interface userToken {
  id: number;
  nombre: string;
}

export type SuccesArgs = Pick<
  SendResponseArgs,
  "res" | "message" | "data" | "error" | "authorization" | "pagination"
>;

export type ErrorResponseArgs = Pick<
  SendResponseArgs,
  "res" | "error" | "statusCode"
>;

export type UnautorizedResponseArgs = Pick<
  SendResponseArgs,
  "res" | "error" | "message"
>;

export interface googleSecions {
  token: string;
  refreshToken: string;
  correo: string;
}
