'use strict';

var passport       = require('passport'),
    authKey        = require('./keys.nogit.js').web,
    OAuth2Strategy = require('passport-google-oauth').OAuth2Strategy,
    request        = require('request'),
    User = require('../user/user_model');

var port = process.env.PORT || 9000;

var authCallback = function(accessToken, refreshToken, profile, done) {
  request.get({
    url: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
    qs: {
      access_token: accessToken
    }
  }, function (err, res, body) {
    if (!err) {
      var openIdProfile = JSON.parse(body);
      var user = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: openIdProfile
      }
      var returnUser = {
        accessToken: user.accessToken,
        profile: user.profile
      };
      done(null, returnUser);
    }
  });
}

passport.use('google', new OAuth2Strategy({
  authorizationURL: authKey.auth_uri,
  tokenURL: authKey.token_uri,
  clientID: authKey.client_id,
  clientSecret: authKey.client_secret,

  callbackURL: 'http://home.bleathem.ca:' + port + '/oauth/google/callback',
}, authCallback));


module.exports = exports = {
  passport: passport,
  OAuth2Strategy: OAuth2Strategy
};
