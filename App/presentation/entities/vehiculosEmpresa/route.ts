import { Router } from "express";
import { VehiculosEmpresaController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class RoutesVehiculos {
  static get routes() {
    const router = Router();
    const vehiculoController = new VehiculosEmpresaController();

    router.get("/", vehiculoController.getAllVehiculos);
    router.get("/choferes", vehiculoController.getAllChoferes);
    router.get("/:id", vehiculoController.getByID);
    router.post("/", adminAccess, vehiculoController.create);
    router.patch("/", adminAccess, vehiculoController.updateVehiculo);

    return router;
  }
}
