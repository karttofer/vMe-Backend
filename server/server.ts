// Dependenceis
import * as express from "express";
import * as bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

// External
import { routerCaller } from "./extras/routes";

dotenv.config();

export const app: express.Express = express();
const prisma = new PrismaClient();
const port = process.env.HOST_POSRT || 3000;

/**
 * SERVER CONFIGS
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * SERVER IS RUNNING
 */
app.listen(port, () => {
  console.log("SERVER IS RUNNING AT PORT:", port);
  routerCaller(app, prisma);
});
