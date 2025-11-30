import { Router } from "express";
import { ProductosRouter } from "./productos/route.js";

export class EntitiesRoutes {
  static get routes() {
    const router = Router();

    router.use("/products", ProductosRouter.routes);

    return router;
  }
}
