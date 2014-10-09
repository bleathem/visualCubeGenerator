'use strict';

var express = require('express');
var app = express();
var routers = {};
var solveRouter = express.Router();
var userRouter = express.Router();
routers.solveRouter = solveRouter;
routers.userRouter = userRouter;

require('./config.js')(app, express, routers);

require('../solve/solve_routes.js')(solveRouter);
require('../user/user_routes.js')(userRouter);

module.exports = exports = app;
