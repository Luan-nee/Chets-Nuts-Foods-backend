import { Router } from "express";
import { EntitiesRoutes } from "../presentation/entities/routes.js";
import { SessionRoutes } from "../presentation/auth/routes.js";
import { AuthMiddleware } from "../presentation/middleware/Auth.middleware.js";
import {
  ClientAccessMiddleware,
  noClientAccessMiddleware,
} from "../presentation/middleware/Client.middleware.js";
import { RoutesClient } from "../presentation/client/route.js";

export class ApiRoutes {
  static get routes() {
    const router = Router();

    router.use("/auth", SessionRoutes.routes);

    router.use(
      "/client",
      [AuthMiddleware.request, ClientAccessMiddleware],
      RoutesClient.routes,
    );

    router.use(
      [AuthMiddleware.request, noClientAccessMiddleware],
      EntitiesRoutes.routes,
    );

    return router;
  }
}
