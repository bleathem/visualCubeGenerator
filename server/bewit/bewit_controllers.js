'use strict';
var urljoin = require('urljoin')
  , hawk    = require('hawk')
  , _       = require('underscore')
  ;

var credentials = {
  id: 'l',
  key: 'mysupersecretkey',
  algorithm: 'sha256'
};

var credentialsFunc = function(id, callback) {
  return callback(null, credentials);
};

module.exports = exports = {
  getActivationLink: function (user) {
    var host = process.env.REST_PROTOCOL + '://' + process.env.REST_HOSTNAME + ':' + process.env.REST_PORT;
    var url = urljoin(host, '/solve/csv?user_id=' + user._id.valueOf());
    var bewit = hawk.uri.getBewit(url, {
      credentials: credentials,
      ttlSec:      60 * 5
    });
    return url + '&bewit=' + bewit;
  },

  validateMac: function (req, res, next) {
    var reqFixed = _.extend({}, req);
    reqFixed.url = '/solve' + reqFixed.url;
    hawk.uri.authenticate(reqFixed, credentialsFunc, {}, function (err, credentials, attributes) {
      if (err) {
        return res.status(401).send(err.message);
      }
      next();
    });
  }
};
