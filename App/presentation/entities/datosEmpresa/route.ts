import { Router } from "express";
import { DatosEmpresaController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class DatosEmpresaRouter {
  static get routes() {
    const router = Router();
    const controllerDatos = new DatosEmpresaController();

    router.post("/", adminAccess, controllerDatos.create);

    return router;
  }
}
