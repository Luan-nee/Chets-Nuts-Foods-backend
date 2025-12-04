import { Router } from "express";
import { ProductosController } from "./controller.js";

export class ProductosRouter {
  static get routes() {
    const router = Router();
    const productos = new ProductosController();

    router.get("/", productos.getAll);

    router.get("/:id", productos.getID);

    return router;
  }
}
