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
  var staticRoot = __dirname + '/../../client/www';
  app.use('/app', express.static(staticRoot + '/app'));
  app.use('/css', express.static(staticRoot + '/css'));
  app.use('/fonts', express.static(staticRoot + '/fonts'));
  app.use('/img', express.static(staticRoot + '/img'));
  app.use('/js', express.static(staticRoot + '/js'));
  app.use(passport.initialize());
  app.use('/api/oauth', routers.oauthRouter);
  app.use('/api/solve', routers.solveRouter);
  app.use('/api/user', routers.userRouter);
  app.use('/api/bewit', routers.bewitRouter);
  app.use('/api/category', routers.categoryRouter);
  routers.categoryRouter.use('/:category/solve', routers.solveRouter);
  app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: staticRoot });
  });
  app.use(middle.logError);
  app.use(middle.handleError);
};
