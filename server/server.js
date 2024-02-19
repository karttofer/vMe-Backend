"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Dependenceis
var express = require("express");
var bodyParser = require("body-parser");
// External
var routes_1 = require("./extras/routes");
exports.app = express();
var port = process.env.PORT || 3000;
/**
 * SERVER CONFIGS
 */
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use(bodyParser.json());
/**
 * SERVER IS RUNNING
 */
exports.app.listen(port, function () {
    console.log('SERVER IS RUNNING AT PORT', port);
    (0, routes_1.routerCaller)(exports.app);
});
