import { Router } from "express";
import { EstablecimientosController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class EstablecimientoRoutes {
  static get routes() {
    const router = Router();
    const establecimiento = new EstablecimientosController();
    router.post("/", adminAccess, establecimiento.create);
    return router;
  }
}
