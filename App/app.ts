import express from "express";
import { RouterPrincipal } from "./routes/index.route.js";
import cors from "cors";
import { pagePermises } from "./consts.js";
import { errorMidleware } from "./presentation/middleware/error.middleware.js";

const APP = express();
const rutas = new RouterPrincipal();

APP.use(cors({ origin: pagePermises }));
APP.use(express.json());
APP.use(rutas.router());
APP.use(errorMidleware);

export default APP;
