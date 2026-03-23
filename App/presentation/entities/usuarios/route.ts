import { Router } from "express";
import { UsuariosController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class UsuariosRouter {
  static get routes() {
    const router = Router();
    const usuarios = new UsuariosController();

    router.get("/", usuarios.getAll);
    router.post("/", adminAccess, usuarios.create);
    router.patch("/", usuarios.update);
    router.post("/dni", usuarios.getByDni);
    router.post("/ruc", usuarios.getByRuc);
    return router;
  }
}
