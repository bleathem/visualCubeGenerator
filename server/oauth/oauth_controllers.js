'use strict';

var request        = require('request')
  , clientKey      = require('./keys.nogit.js').client
  , User           = require('../user/user_model')
  , Q              = require('q')
  ;

var getTokenInfo = function(accessToken) {
  var deferred = Q.defer();
  request.get({
    url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
    qs: {
      access_token: accessToken
    }
  }, function (err, res, body) {
    if (!err) {
      var params = JSON.parse(body);
      deferred.resolve(params);
    } else {
      deferred.reject(err);
    }
  });
  return deferred.promise;
}

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
            if (tokens.length > 10) {
              tokens = tokens.slice(0, 9);
            }
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

module.exports = exports = {
  authCallback: authCallback,
  getTokenInfo: getTokenInfo
};
