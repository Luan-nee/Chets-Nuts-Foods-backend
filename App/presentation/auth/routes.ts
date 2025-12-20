import { Router } from "express";
import { AuthController } from "./controller.js";

export class SessionRoutes {
  static get routes() {
    const router = Router();
    const sessionInit = new AuthController();

    router.post("/login", sessionInit.sessionMain);

    return router;
  }
}
