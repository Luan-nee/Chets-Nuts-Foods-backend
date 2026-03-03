import { Request, Response } from "express";
import { LoginUserDto } from "../../domain/dto/auth/loginUser.dto.js";
import { CustomResponse } from "../../core/res/custom.response.js";
import SessionUserUseCase from "../../domain/use-cases/auth/sessionUser.use-case.js";

export class AuthController {
  sessionMain = (req: Request, res: Response) => {
    console.log(req.body);
    const [error, sessionDtoUser] = LoginUserDto.createSessionUserMain(
      req.body,
    );
    console.log(sessionDtoUser);
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
}
