'use strict';

var passport       = require('passport'),
    authKey        = require('./keys.nogit.js').web,
    OAuth2Strategy = require('passport-google-oauth').OAuth2Strategy,
    request        = require('request'),
    User           = require('../user/user_model'),
    BearerStrategy = require('passport-http-bearer').Strategy

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
      openIdProfile.token = {
        access_token: accessToken,
        refresh_token: refreshToken
      }
      var user = {
        name: openIdProfile.name,
        giveName: openIdProfile.given_name,
        familyName: openIdProfile.family_name,
        googleAccount: openIdProfile
      }
      User.findOneAndUpdate(
        { 'googleAccount.sub': openIdProfile.sub },
        user,
        { new: true,
          upsert: true,
          select: {
            'googleAccount.token.refresh_token': 0
          }
        },
        function(err, createdUser) {
          if (!err) {
            done(null, createdUser);
          }
        });
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

passport.use(new BearerStrategy(
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
