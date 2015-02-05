'use strict';

var passport       = require('passport')
  , authKey        = require('./keys.nogit.js').web
  , OAuth2Strategy = require('passport-google-oauth').OAuth2Strategy
  , User           = require('../user/user_model')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , controller     = require('./oauth_controllers')
  ;

passport.use('google', new OAuth2Strategy({
  authorizationURL: authKey.auth_uri,
  tokenURL: authKey.token_uri,
  clientID: authKey.client_id,
  clientSecret: authKey.client_secret,

  callbackURL: process.env.REST_PROTOCOL + '://' + process.env.REST_HOSTNAME + ':' + process.env.REST_PORT + '/api/oauth/google/callback',
}, controller.authCallback));

passport.use('bearer', new BearerStrategy(
  function(token, done) {
    User.findOne({'googleAccount.token.access_token': token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));

module.exports = exports = {
  passport: passport,
  OAuth2Strategy: OAuth2Strategy
};
