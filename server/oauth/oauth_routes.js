'use strict';

var passport    = require('./oauth_config.js').passport
  , querystring = require('querystring')
  , url         = require('url')
  , controller  = require('./oauth_controllers')
  ;

var referrer;

module.exports = exports = function (router) {
  router
    .get('/google', function (req, res, next) {
      referrer = req.get('Referrer');
      passport.authenticate('google', {
        scope: ['openid', 'email']
        , accessType: 'offline'
        // , approvalPrompt: 'force'
      })(req, res, next);
    })
    .get('/google/callback', function (req, res, next) {
      passport.authenticate('google', function(err, user) {
        var error = '',
            userString = '';
        if (err) {
          error = JSON.stringify(err);
        } else if (!user) {
          error = 'Authentication failure';
        } else {
          userString = querystring.escape(JSON.stringify(user));
        }

        var host = (process.env.NODE_ENV === 'production')
          ? 'http://' + process.env.CLIENT_HOSTNAME + (process.env.CLIENT_PORT == 80 ? '/' : ':' + process.env.CLIENT_PORT + '/')
          : url.resolve(referrer, '/');
        var redirect = host + '#/oauth/callback?user=' + userString + '&error=' + error;
        console.log('Oauth google callback re-directing to:' + redirect);
        // res.redirect(redirect);
        // res.send('hello');
        res.send('<script type="text/javascript">window.location="' + redirect + '"</script>');
      })(req, res, next);
    })
    .post('/google/clientlogin', function (req, res, next) {
      var token = req.body.token;
      controller.getTokenInfo(token).then(function(params) {
        controller.authCallback(token, null, params, null, function(err, user) {
          if (!err) {
            res.send(user);
          } else {
            next(err);
          }
        });
      }, function(error) {
        next(err);
      })
    })
    ;
};
