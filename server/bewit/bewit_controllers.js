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
    var options = {
      port: process.env.REST_PORT,
      host: process.env.REST_HOSTNAME
    };
    hawk.uri.authenticate(reqFixed, credentialsFunc, options, function (err) {
      if (err) {
        console.log({
          url: req.url,
          host: req.host,
          port: req.port
        });
        return res.status(401).send(err.message);
      }
      next();
    });
  }
};
