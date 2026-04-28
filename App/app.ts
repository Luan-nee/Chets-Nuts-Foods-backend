import express from "express";
import { RouterPrincipal } from "./routes/index.route.js";
import cors from "cors";
import { pagePermises } from "./consts.js";
const APP = express();
const rutas = new RouterPrincipal();

APP.use(cors({ origin: pagePermises }));
APP.use(express.json());
APP.use(rutas.router());

export default APP;
