"use strict";

var express = require('express');
var app = express();
var routers = {};
var solveRouter = express.Router();
routers.solveRouter = solveRouter;

require('./config.js')(app, express, routers);

require('../solve/solve_routes.js')(solveRouter);

module.exports = exports = app;
