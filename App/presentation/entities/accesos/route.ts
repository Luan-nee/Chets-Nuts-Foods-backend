import { Router } from "express";
import { AccesosController } from "./controller.js";

export class AccesosRouter {
  static get routes() {
    const router = Router();
    const controller = new AccesosController();

    router.get("/", controller.getAll);
    router.get("/roles", controller.getRules);
    router.get("/:id", controller.getByID);
    router.post("/", controller.create);
    router.patch("/", controller.update);
    return router;
  }
}
