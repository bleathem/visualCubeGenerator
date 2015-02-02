'use strict';

var passport    = require('./oauth_config.js').passport
  , querystring = require('querystring')
  , url         = require('url')
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
        var host = 'http://' + process.env.CLIENT_HOSTNAME + (process.env.CLIENT_PORT == 80 ? '/' : ':' + process.env.CLIENT_PORT + '/');
        var redirect = host + '#/oauth/callback?user=' + userString + '&error=' + error;
        console.log('Oauth google callback re-directing to:' + redirect);
        // res.redirect(redirect);
        // res.send('hello');
        res.send('<script type="text/javascript">window.location="' + redirect + '"</script>');
      })(req, res, next);
    });
};
