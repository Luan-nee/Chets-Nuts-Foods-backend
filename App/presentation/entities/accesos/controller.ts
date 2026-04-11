import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateAccesDto } from "../../../domain/dto/auth/createAcces.dto.js";
import { CreateAccesoUseCase } from "../../../domain/use-cases/accesos/createAcceso.js";
import { UpdateAccesDto } from "../../../domain/dto/auth/UpdateAccess.dto.js";
import { UsuarioDto } from "../../../domain/dto/usuarios/usuario.dto.js";
import { PageDataDto } from "../../../domain/query-params/pageData.dto.js";

export class AccesosController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }

    const [error, accesoDto] = CreateAccesDto.createSessionUserMain(req.body);

    if (accesoDto === undefined || error !== undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const [error2, userDto] = UsuarioDto.createUserDto(req.body);

    if (error2 !== undefined || userDto === undefined) {
      CustomResponse.badRequest({ res, error: error2 });
      return;
    }

    const accesoUseCase = new CreateAccesoUseCase();
    accesoUseCase
      .createExec(userDto, accesoDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((err) => {
        console.log(err);
        CustomResponse.badRequest({ res, error: err });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }
    const page = PageDataDto.create(req.query);
    const accesoUse = new CreateAccesoUseCase();

    accesoUse
      .getAll(page)
      .then(({ data, paginasResponse }) => {
        CustomResponse.success({ res, data, pagination: paginasResponse });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  update = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const [error, updateDto] = UpdateAccesDto.updateAcceso(req.body);
    if (error !== undefined || updateDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const accesoUseCase = new CreateAccesoUseCase();

    accesoUseCase
      .update(updateDto)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((err) => {
        console.log(err);
        CustomResponse.badRequest({ res, error: err });
      });
  };

  getByID = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }

    const id = Number(req.params.id);

    if (id === undefined || typeof id !== "number") {
      CustomResponse.badRequest({ res, error: "Id erroneo" });
      return;
    }

    const accesoUse = new CreateAccesoUseCase();

    accesoUse
      .getByID(id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
