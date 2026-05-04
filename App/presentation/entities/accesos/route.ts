import { Router } from "express";
import { AccesosController } from "./controller.js";
import { adminAccess } from "../../middleware/adminAccess.middleware.js";

export class AccesosRouter {
  static get routes() {
    const router = Router();
    const controller = new AccesosController();

    router.get("/", adminAccess, controller.getAll);
    router.get("/roles", controller.getRules);
    router.get("/:id", controller.getByID);
    router.post("/", adminAccess, controller.create);
    router.patch("/", adminAccess, controller.update);
    return router;
  }
}
