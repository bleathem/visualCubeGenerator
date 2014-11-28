'use strict';

var controller  = require('./bewit_controllers.js')
  , passport    = require('../oauth/oauth_config.js').passport
  ;


module.exports = exports = function (router) {
  router
    .get('/code', passport.authenticate('bearer', { session: false }), function (req, res) {
      res.end(controller.getActivationLink(req.user));
    });
};
