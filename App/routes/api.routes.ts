import { Router } from "express";
import { EntitiesRoutes } from "../presentation/entities/routes.js";
import { SessionRoutes } from "../presentation/auth/routes.js";
import { AuthMiddleware } from "../presentation/middleware/Auth.middleware.js";

export class ApiRoutes {
  static get routes() {
    const router = Router();

    router.use("/auth", SessionRoutes.routes);

    /*router.use(
      [AuthMiddleware.request, AuthMiddleware.verifiAcceso],
      EntitiesRoutes.routes
    );*/
    router.use(AuthMiddleware.request, EntitiesRoutes.routes);

    return router;
  }
}
