import { Request, Response } from "express";
import { LoginUserDto } from "../../domain/dto/auth/loginUser.dto.js";
import { CustomResponse } from "../../core/res/custom.response.js";
import SessionUserUseCase from "../../domain/use-cases/auth/sessionUser.use-case.js";
import { ClientLoginDTO } from "../../domain/dto/auth/clientLogin.dto.js";
import SessionClienteUseCase from "../../domain/use-cases/auth/sessionCliente.use-case.js";

export class AuthController {
  sessionMain = (req: Request, res: Response) => {
    const [error, sessionDtoUser] = LoginUserDto.createSessionUserMain(
      req.body,
    );

    if (error != undefined || sessionDtoUser === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const initSession = new SessionUserUseCase();
    initSession
      .sessionUser(sessionDtoUser)
      .then((data) => {
        const data2 = {
          nombreUser: data.nombreUser,
          rol: data.rol,
          tokenZ: data.tokenZ,
        };

        CustomResponse.success({
          res,
          data: data2,
          message: data.mensajeAlert,
        });
      })
      .catch((error: Error) => {
        CustomResponse.badRequest({ res, error });
      });
  };

  sessionCliente = (req: Request, res: Response) => {
    const [error, sessionClient] = ClientLoginDTO.createClientSeccion(req.body);

    if (error !== undefined || sessionClient === undefined) {
      CustomResponse.badRequest({ res, error });
      return;
    }

    const accesoSession = new SessionClienteUseCase();

    accesoSession
      .sessionCliente(sessionClient)
      .then((data) => {
        CustomResponse.success({ res, data });
      })
      .catch((error) => {
        CustomResponse.badRequest({ res, error });
      });
  };
}
