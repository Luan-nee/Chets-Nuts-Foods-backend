import { Router } from "express";
import { controllerSeguimientoPaquete } from "./controllerSeguimiento.js";

export class RoutesSeguimientoSalidaTransporte {
  static get routes() {
    const route = Router();
    const controllerSeguimiento = new controllerSeguimientoPaquete();

    route.get("/salida/:id", controllerSeguimiento.getAll);
    route.post("/salida/:id", controllerSeguimiento.create);
    route.post("/paquete/:id", controllerSeguimiento.sendPaquete);

    return route;
  }
}
