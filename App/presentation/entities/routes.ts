import { Router } from "express";
import { UsuariosRouter } from "./usuarios/route.js";
import { DatosEmpresaRouter } from "./datosEmpresa/route.js";
import { EstablecimientoRoutes } from "./establecimientos/route.js";
import { AccesosRouter } from "./accesos/route.js";
import { adminAccess } from "../middleware/adminAccess.middleware.js";
import { RoutesVehiculos } from "./vehiculosEmpresa/route.js";
import { RoutesSalidaTransporte } from "./salidaTransporte/route.js";

export class EntitiesRoutes {
  static get routes() {
    const router = Router();
    router.use("/usuarios", UsuariosRouter.routes);
    router.use("/empresa", DatosEmpresaRouter.routes);
    router.use("/establecimientos", EstablecimientoRoutes.routes);
    router.use("/accesos", adminAccess, AccesosRouter.routes);
    router.use("/vehiculos", RoutesVehiculos.routes);
    router.use("/salidas", RoutesSalidaTransporte.routes);
    return router;
  }
}
