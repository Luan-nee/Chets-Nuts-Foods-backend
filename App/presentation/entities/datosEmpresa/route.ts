import { Router } from "express";
import { DatosEmpresaController } from "./controller.js";

export class DatosEmpresaRouter {
  static get routes() {
    const router = Router();
    const controllerDatos = new DatosEmpresaController();

    router.post("/", controllerDatos.create);

    return router;
  }
}
