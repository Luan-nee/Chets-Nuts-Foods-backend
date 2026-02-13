import { Request, Response } from "express";
import { CustomResponse } from "../../../core/res/custom.response.js";
import { UsuarioDto } from "../../../domain/dto/usuarios/usuario.dto.js";
import { UsuariosUseCase } from "../../../domain/use-cases/usuarios/Usuarios.use-case.js";
import { emitSocket } from "../../../controllerSockets/globalSocket.js";

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
    //const [error,userDto] =
  };
}
