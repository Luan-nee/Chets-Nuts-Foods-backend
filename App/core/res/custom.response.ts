import { ResponseStatus } from "../../consts.js";
import {
  ErrorResponseArgs,
  SendResponseArgs,
  SuccesArgs,
  UnautorizedResponseArgs,
} from "../core.js";

export class CustomResponse {
  static send({
    res,
    status = ResponseStatus.success,
    authorization,
    data,
    error,
    message,
    statusCode = 200,
    pagination,
  }: SendResponseArgs) {
    const response = {
      status,
      message,
      data,
      error,
      pagination,
    };

    if (authorization !== undefined) {
      return res.header("Authorization", authorization);
    }
    if (typeof response.data === "string") {
      try {
        response.data = JSON.parse(data);
      } catch (error) {}
    }

    if (typeof response.error === "string") {
      try {
        response.error = JSON.parse(error);
      } catch (error) {}
    }

    res.status(statusCode).json(response);
  }

  static success({
    res,
    message,
    data,
    authorization,
    pagination,
  }: SuccesArgs) {
    this.send({
      res,
      data,
      message,
      status: ResponseStatus.success,
      statusCode: 200,
      authorization,
      pagination,
    });
  }

  static badRequest({ res, error }: ErrorResponseArgs) {
    console.log(error);
    const error2 =
      typeof error === "string" ? JSON.parse(error) : new Error(error).message;
    this.send({
      res,
      status: ResponseStatus.error,
      message: error2,
      statusCode: 400,
    });
  }
  static unauthorized({ res, error, message }: UnautorizedResponseArgs) {
    this.send({
      res,
      error,
      status: ResponseStatus.fail,
      statusCode: 401,
      message,
    });
  }
}
