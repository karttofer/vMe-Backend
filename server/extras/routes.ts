// Dependencies
import { Request, Response } from 'express'

/*
 USER ROUTES
*/
interface ILoginPost {
    email: string,
    password: string
}
interface IUserEditPost {
    last_name: string,
    nick_name: string,
    github_user: string,
    linkedIn_user: string
    user_img: string
}
/*
 CREATE ROUTES
*/
interface ICreateAccountPost {
    user_name: string
    fist_name: string
    last_name: string
    user_img: string
    password: string
    email: string
    location: string
    linkedIn_user: string
    github_user: string
}
interface IResetPasswordMagicLinkPost {
    email: string
}

interface IResetPasswordPost {
    new_password: string
}
/*
 ROUTE CALLER
*/
export const routerCaller = (app) => {


    try {
        app.get('/', (req: Request, res: Response) => {
            res.send('Hello World!')
        })
        app.post("/user/edit", (req: Request<{}, {}, IUserEditPost>, res: Response) => {
            res.send({ user: req.body })
        });
        app.post("/login", (req: Request<{}, {}, ILoginPost>, res: Response) => {
            res.send({ login: req.body })
        });
        app.post("/create/new-password", (req: Request<{}, {}, IResetPasswordPost>, res: Response) => {
            res.send({ newPassword: req.body })
        });
        app.post("/create/magic-link/reset-password", (req: Request<{}, {}, IResetPasswordMagicLinkPost>, res: Response) => {
            res.send({ maginLink: req.body })
        });
        app.post("/create/account", (req: Request<{}, {}, ICreateAccountPost>, res: Response) => {
            res.send({ registration: req.body })
        });
    } catch (error) {
        console.error(`Ups, Something's wrong happening here -> `, Error);
    }
}