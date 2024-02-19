"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerCaller = void 0;
/*
 ROUTE CALLER
*/
var routerCaller = function (app) {
    try {
        app.get('/', function (req, res) {
            res.send('Hello World!');
        });
        app.post("/user/edit", function (req, res) {
            res.send({ user: req.body });
        });
        app.post("/login", function (req, res) {
            res.send({ login: req.body });
        });
        app.post("/create/new-password", function (req, res) {
            res.send({ newPassword: req.body });
        });
        app.post("/create/magic-link/reset-password", function (req, res) {
            res.send({ maginLink: req.body });
        });
        app.post("/create/account", function (req, res) {
            res.send({ registration: req.body });
        });
    }
    catch (error) {
        console.error("Ups, Something's wrong happening here -> ", Error);
    }
};
exports.routerCaller = routerCaller;
