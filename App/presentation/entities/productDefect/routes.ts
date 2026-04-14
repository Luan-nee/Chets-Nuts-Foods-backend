import { Router } from "express";
import { ProductosDefectController } from "./controller.js";

export class RoutesProductDefect {
  static get routes() {
    const routes = Router();
    const controller = new ProductosDefectController();
    routes.get("/", controller.getAll);
    routes.post("/", controller.create);
    return routes;
  }
}
