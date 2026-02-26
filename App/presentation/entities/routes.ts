import { Router } from "express";
import { ProductosRouter } from "./productos/route.js";
import { UsuariosRouter } from "./usuarios/route.js";
import { DatosEmpresaRouter } from "./datosEmpresa/route.js";

export class EntitiesRoutes {
  static get routes() {
    const router = Router();

    //router.use("/products", ProductosRouter.routes);
    router.use("/usuarios", UsuariosRouter.routes);
    router.use("/empresa", DatosEmpresaRouter.routes);
    return router;
  }
}
