import { Router } from "express";
import { UsuariosController } from "./controller.js";

export class UsuariosRouter {
  static get routes() {
    const router = Router();
    const usuarios = new UsuariosController();

    router.post("/", usuarios.create);

    return router;
  }
}
