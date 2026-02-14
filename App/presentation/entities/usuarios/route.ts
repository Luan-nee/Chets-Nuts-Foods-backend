import { Router } from "express";
import { UsuariosController } from "./controller.js";

export class UsuariosRouter {
  static get routes() {
    const router = Router();
    const usuarios = new UsuariosController();

    router.get("/", usuarios.getAll);
    router.post("/", usuarios.create);
    router.patch("/", usuarios.update);
    router.post("/dni", usuarios.getByDni);
    router.post("/ruc", usuarios.getByRuc);
    return router;
  }
}
