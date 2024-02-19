// Dependencies
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Models
import {
  IUserEditPost,
  ILoginPost,
  IResetPasswordPost,
  IResetPasswordMagicLinkPost,
  ICreateAccountPost,
} from "./models/requests";

// Actions
import { CREATE_NEW_USER, LOGIN } from "./actions";
/*
 ROUTE CALLER
*/
export const routerCaller = (app, prisma: PrismaClient) => {
  try {
    app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
    });

    /**
     * USER
     * */
    app.post(
      "/user/edit",
      (req: Request<{}, {}, IUserEditPost>, res: Response) => {
        res.send({ user: req.body });
      }
    );

    /**
     * LOGIN
     */
    app.post("/login", (req: Request<{}, {}, ILoginPost>, res: Response) => {
      LOGIN(req.body, prisma).then((actionRes) => {
        console.log(actionRes);
        res.send({ Login: actionRes });
      });
    });

    /**
     * CREATE ROUTES
     */
    app.post(
      "/create/new-password",
      (req: Request<{}, {}, IResetPasswordPost>, res: Response) => {
        res.send({ newPassword: req.body });
      }
    );
    app.post(
      "/create/magic-link/reset-password",
      (req: Request<{}, {}, IResetPasswordMagicLinkPost>, res: Response) => {
        res.send({ maginLink: req.body });
      }
    );
    app.post(
      "/create/account",
      (req: Request<{}, {}, ICreateAccountPost>, res: Response) => {
        // Actions
        CREATE_NEW_USER(req.body, prisma);

        // Final Request
        res.send({
          message: `Ey, ${req.body.nick_name} you're now part of the family!`,
        });
      }
    );
  } catch (error) {
    console.error(`Ups, Something's wrong happening here -> `, Error);
  }
};
