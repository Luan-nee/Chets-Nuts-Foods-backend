import { Router } from "express";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";
import { SalidaTransporteController } from "./controller.js";

export class RoutesSalidaTransporte {
  static get routes() {
    const route = Router();
    const controller = new SalidaTransporteController();

    route.get("/", controller.getAll);
    route.get("/:id", controller.getByID);
    route.post("/", adminAccess, controller.create);

    return route;
  }
}
