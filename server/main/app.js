'use strict';

var express = require('express');
var app = express();
var routers = {};
var oauthRouter = express.Router();
var solveRouter = express.Router();
var userRouter = express.Router();
var bewitRouter = express.Router();
routers.solveRouter = solveRouter;
routers.userRouter = userRouter;
routers.oauthRouter = oauthRouter;
routers.bewitRouter = bewitRouter;

require('./config.js')(app, express, routers);

require('../oauth/oauth_routes.js')(oauthRouter);
require('../solve/solve_routes.js')(solveRouter);
require('../user/user_routes.js')(userRouter);
require('../bewit/bewit_routes.js')(bewitRouter);

module.exports = exports = app;
