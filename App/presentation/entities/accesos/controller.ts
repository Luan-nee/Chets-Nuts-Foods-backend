import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { CreateAccesDto } from "../../../domain/dto/auth/createAcces.dto.js";
import { CreateAccesoUseCase } from "../../../domain/use-cases/accesos/createAcceso.js";
import { UpdateAccesDto } from "../../../domain/dto/auth/UpdateAccess.dto.js";
import { UsuarioDto } from "../../../domain/dto/usuarios/usuario.dto.js";
import { PageDataDto } from "../../../domain/query-params/pageData.dto.js";
import { NumericId } from "../../../domain/query-params/numericId-dto.js";

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
        CustomResponse.success({
          res,
          data,
          message: "usuario creado con exito",
        });
      })
      .catch((err) => {
        CustomResponse.badRequest({ res, error: err });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "No tienes permisos" });
      return;
    }
    const [page, error] = PageDataDto.create(req.query);
    if (error !== undefined) {
      CustomResponse.badRequest({ res, error: error });
      return;
    }
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
    console.log(req.params);
    const [error, id] = NumericId.create(req.params);
    if (error !== undefined || id === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const accesoUse = new CreateAccesoUseCase();

    accesoUse
      .getByID(id.id)
      .then(({ data, mensaje }) => {
        CustomResponse.success({ res, data, message: mensaje });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getRules = async (req: Request, res: Response) => {
    const accesoUse = new CreateAccesoUseCase();
    const rutas = await accesoUse.getRoles();
    console.log(rutas);
    CustomResponse.success({ res, data: rutas });
  };
}
