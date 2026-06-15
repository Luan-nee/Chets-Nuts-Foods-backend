import { Router } from "express";
import { ControllerCliente } from "./controller.js";

export class RoutesClient {
  static get routes() {
    const router = Router();

    const clientControl = new ControllerCliente();

    router.get("/", clientControl.getAll);

    router.get("/seg", clientControl.getSeguimiento);

    router.get("/products", clientControl.getProductos);

    return router;
  }
}
