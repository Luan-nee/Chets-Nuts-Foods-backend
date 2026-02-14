import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { UsuarioDto } from "../../../domain/dto/usuarios/usuario.dto.js";
import { UsuariosUseCase } from "../../../domain/use-cases/usuarios/Usuarios.use-case.js";
import { emitSocket } from "../../../controllerSockets/globalSocket.js";
import { UpdateUsuarioDto } from "../../../domain/dto/usuarios/UpdateUsuario.dto.js";

export class UsuariosController {
  create = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes permisos de estar aqui",
      });
      return;
    }
    const [error, userDto] = UsuarioDto.createUserDto(req.body);
    if (error !== undefined || userDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }
    const createUser = new UsuariosUseCase();
    createUser
      .create(userDto, req.authpayload.id)
      .then((data) => {
        emitSocket(req, "newUser", data);
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  update = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes personas",
      });
      return;
    }

    const [error, userUpdateDto] = UpdateUsuarioDto.createUpdateUser(req.body);

    if (error !== undefined || userUpdateDto === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const userUse = new UsuariosUseCase();

    userUse
      .update(userUpdateDto, req.authpayload.id)
      .then((data) => {
        emitSocket(req, "updateUser", data);
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  getAll = (req: Request, res: Response) => {
    if (req.authpayload == undefined) {
      CustomResponse.badRequest({
        res,
        error: "No tienes acceso o la secion caduco",
      });
      return;
    }

    const userCase = new UsuariosUseCase();

    userCase
      .getAll(req.authpayload.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
  getByDni = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "NO TIENES PERMISOS" });
      return;
    }

    const [error, dni] = UsuarioDto.validDniUserDto(req.body);

    if (error !== undefined || dni === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const userCase = new UsuariosUseCase();
    userCase
      .GetByDni(dni, req.authpayload.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
  getByRuc = (req: Request, res: Response) => {
    if (req.authpayload === undefined) {
      CustomResponse.badRequest({ res, error: "NO TIENES PERMISOS" });
      return;
    }

    const [error, ruc] = UsuarioDto.validRucUserDto(req.body);
    if (error !== undefined || ruc === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const userCase = new UsuariosUseCase();

    userCase
      .GetByRuc(ruc, req.authpayload.id)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
