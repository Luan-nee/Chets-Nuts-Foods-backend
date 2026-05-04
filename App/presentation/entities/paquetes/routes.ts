import { Router } from "express";
import { PaquetesController } from "./controller.js";
import { ControllerProductosPaquetes } from "./controllerProductosPaquetes.js";
import { controllerSeguimientoPaquete } from "./controllerSeguimiento.js";

export class RoutesPaquetes {
  static get routes() {
    const routes = Router();
    const controller = new PaquetesController();
    const controllerProductos = new ControllerProductosPaquetes();
    const controllerSeguimiento = new controllerSeguimientoPaquete();

    routes.get("/:id", controller.getAll);
    routes.get("/:id/productos", controllerProductos.getAllProductos);
    routes.get("/data/:id", controller.getByID);

    routes.post("/", controller.create);
    routes.post("/:id/producto", controllerProductos.registrarProducto);
    routes.post("/:id/seguimiento", controllerSeguimiento.create);

    return routes;
  }
}
