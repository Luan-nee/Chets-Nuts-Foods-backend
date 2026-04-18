import { Router } from "express";
import { PaquetesController } from "./controller.js";

export class RoutesPaquetes {
  static get routes() {
    const routes = Router();
    const controller = new PaquetesController();

    routes.post("/", controller.create);
    routes.get("/:id", controller.getAll);
    routes.get("/data/:id", controller.getByID);
    return routes;
  }
}
