import { Router } from "express";
import { EntitiesRoutes } from "../presentation/entities/routes.js";

export class ApiRoutes {
  static get routes() {
    const router = Router();

    //const auhtRouter = new RoutesAuth();

    /*router.use(
      [AuthMiddleware.request, AuthMiddleware.verifiAcceso],
      EntitiesRoutes.routes
    );*/
    router.use(EntitiesRoutes.routes);

    return router;
  }
}
