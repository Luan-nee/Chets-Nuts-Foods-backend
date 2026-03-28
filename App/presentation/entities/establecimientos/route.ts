import { Router } from "express";
import { EstablecimientosController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class EstablecimientoRoutes {
  static get routes() {
    const router = Router();
    const establecimiento = new EstablecimientosController();
    router.get("/", establecimiento.getAll);
    router.get("/:id", establecimiento.getByid);
    router.post("/", adminAccess, establecimiento.create);
    router.patch("/", adminAccess, establecimiento.update);
    return router;
  }
}
