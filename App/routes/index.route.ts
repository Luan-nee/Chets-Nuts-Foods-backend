import { Router } from "express";

export class RouterPrincipal {
  router() {
    const router = Router();
    console.log("pasando por las rutas");

    return router;
  }
}
