'use strict';

var passport       = require('passport')
  , authKey        = require('./keys.nogit.js').web
  , OAuth2Strategy = require('passport-google-oauth').OAuth2Strategy
  , request        = require('request')
  , User           = require('../user/user_model')
  , BearerStrategy = require('passport-http-bearer').Strategy
  ;

var authCallback = function(accessToken, refreshToken, params, profile, done) {
  request.get({
    url: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
    qs: {
      access_token: accessToken
    }
  }, function (err, res, body) {
    if (!err) {
      var openIdProfile = JSON.parse(body);
      var expiryDate = new Date().getTime() + params.expires_in;
      var token = {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: params.token_type,
        expiry: expiryDate
      };
      var user = {
        $set: {
          name: openIdProfile.name,
          giveName: openIdProfile.given_name,
          familyName: openIdProfile.family_name
        }
      };
      User.findOneAndUpdate(
        { 'googleAccount.sub': openIdProfile.sub },
        user,
        { new: true,
          upsert: true
        },
        function(err, createdUser) {
          if (!err) {
            var tokens = [token];
            createdUser.googleAccount.token.forEach(function(tokenLoop) {
              tokens.push({
                access_token: tokenLoop.access_token,
                refresh_token: tokenLoop.refresh_token,
                token_type: tokenLoop.token_type,
                expiry: tokenLoop.expiry
              });
            });
            openIdProfile.token = tokens;
            User.findByIdAndUpdate(
              createdUser._id,
              { $set: {
                googleAccount: openIdProfile
                }
              },
              { select: {
                'googleAccount.token.refresh_token': 0
                }
              },
              function(err, updatedUser) {
                if (!err) {
                  var tokens = updatedUser.googleAccount.token.filter(function(tokenLoop) {
                    return token.access_token === tokenLoop.access_token;
                  });
                  updatedUser.googleAccount.token = tokens;
                  done(null, updatedUser);
                } else {
                  done(err);
                }
              }
            );
          } else {
            done(err);
          }
        });
    }
  });
};

passport.use('google', new OAuth2Strategy({
  authorizationURL: authKey.auth_uri,
  tokenURL: authKey.token_uri,
  clientID: authKey.client_id,
  clientSecret: authKey.client_secret,

  callbackURL: process.env.REST_PROTOCOL + '://' + process.env.REST_HOSTNAME + ':' + process.env.REST_PORT + '/oauth/google/callback',
}, authCallback));

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
