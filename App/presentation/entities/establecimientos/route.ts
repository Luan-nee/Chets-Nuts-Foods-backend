import { Router } from "express";
import { EstablecimientosController } from "./controller.js";

export class EstablecimientoRoutes {
  static get routes() {
    const router = Router();
    const establecimiento = new EstablecimientosController();
    router.post("/", establecimiento.create);
    return router;
  }
}
