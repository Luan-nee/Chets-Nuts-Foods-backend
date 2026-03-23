import { Router } from "express";
import { UsuariosRouter } from "./usuarios/route.js";
import { DatosEmpresaRouter } from "./datosEmpresa/route.js";
import { EstablecimientoRoutes } from "./establecimientos/route.js";

export class EntitiesRoutes {
  static get routes() {
    const router = Router();
    router.use("/usuarios", UsuariosRouter.routes);
    router.use("/empresa", DatosEmpresaRouter.routes);
    router.use("/establecimiento", EstablecimientoRoutes.routes);
    return router;
  }
}
