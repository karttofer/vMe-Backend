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
import {
  CREATE_NEW_USER,
  LOGIN,
  SEND_MAGIC_LINK_RESET_PASSWORD,
  VERIFY_MAGIC_LINK_RESET_PASSWORD_EXPIRED,
  RESET_PASSWORD,
  EDIT_USER_INFORMATION
} from "./actions";
/*
 ROUTE CALLER
*/
export const routerCaller = (app, prisma: PrismaClient) => {
  try {
    app.get("/", (_: Request, res: Response) => {
      res.send("Hi human - This is the main - page of code_review_me_backend");
    });

    /**
     * USER
     * */
    app.put(
      "/user/edit",
      (req: Request<{}, {}, IUserEditPost>, res: Response) => {
        EDIT_USER_INFORMATION(req.body, prisma).then(response => {
          res.send({ user: response });

        })
      }
    );

    /**
     * LOGIN
     */
    app.post("/login", (req: Request<{}, {}, ILoginPost>, res: Response) => {
      LOGIN(req.body, prisma)
        .then((actionRes) => {
          res.send({ message: actionRes });
        })
        .catch((error) => {
          console.error(error);
        });
    });

    /**
     * CREATE ROUTES
     */
    app.put(
      "/create/new-password",
      (req: Request<{}, {}, IResetPasswordPost>, res: Response) => {
        RESET_PASSWORD(
          {
            user_unique_token: req.body.user_unique_token,
            new_password: req.body.new_password,
          },
          prisma
        ).then((response) => {
          res.send({ message: response });
        });
      }
    );
    app.post(
      "/create/magic-link/reset-password",
      (req: Request<{}, {}, IResetPasswordMagicLinkPost>, res: Response) => {
        SEND_MAGIC_LINK_RESET_PASSWORD(req.body, prisma)
          .then((actionRes) => {
            res.send({ message: actionRes });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
    app.post(
      "/create/account",
      (req: Request<{}, {}, ICreateAccountPost>, res: Response) => {
        CREATE_NEW_USER(req.body, prisma);

        res.send({
          message: `Ey, ${req.body.nick_name} you're now part of the family!`,
        });
      }
    );

    /**
     * GET
     */
    app.get("/check/reset-password/token", (req: Request, res: Response) => {
      VERIFY_MAGIC_LINK_RESET_PASSWORD_EXPIRED(
        req.query.value as string,
        prisma
      )
        .then((response) => {
          res.send({ message: response });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } catch (error) {
    console.error(`Ups, Something's wrong happening here -> `, Error);
  }
};
