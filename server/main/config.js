'use strict';

var mongoose    = require('mongoose'),
    morgan      = require('morgan'),
    bodyParser  = require('body-parser'),
    passport    = require('../oauth/oauth_config.js').passport,
    middle      = require('./middleware');

mongoose.connect(process.env.DB_URL || 'mongodb://localhost/visualCubeGenerator');
// mongoose.set('debug', true);
/*
 * Include all your global env variables here.
*/
module.exports = exports = function (app, express, routers) {
  app.set('port', process.env.PORT || 9000);
  app.set('base url', process.env.URL || '0.0.0.0');
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(middle.cors);
  app.use(express.static(__dirname + '/../../client/www'));
  app.use(passport.initialize());
  app.use('/oauth', routers.oauthRouter);
  app.use('/solve', routers.solveRouter);
  app.use('/user', routers.userRouter);
  app.use('/bewit', routers.bewitRouter);
  app.use('/category', routers.categoryRouter);
  routers.categoryRouter.use('/:category/solve', routers.solveRouter);
  app.use(middle.logError);
  app.use(middle.handleError);
};
