import { Router } from "express";
import { UsuariosController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class UsuariosRouter {
  static get routes() {
    const router = Router();
    const usuarios = new UsuariosController();

    router.get("/", usuarios.getAll);
    router.get("/clientes", usuarios.getClientes);

    router.post("/", adminAccess, usuarios.create);
    router.post("/clientes", usuarios.createClientes);

    router.patch("/", adminAccess, usuarios.update);
    router.post("/dni", usuarios.getByDni);
    router.post("/dni/dev", usuarios.getByDniDefect);
    router.post("/ruc", usuarios.getByRuc);
    router.post("/ruc/dev", usuarios.getByRucDefect);
    return router;
  }
}
