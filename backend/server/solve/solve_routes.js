"use strict";

var controller = require('./solve_controllers.js'),
    passport   = require('passport');

module.exports = exports = function (router) {
  router.route('/')
    .get(passport.authenticate('bearer', { session: false }), controller.listByUser)
    .post(passport.authenticate('bearer', { session: false }), controller.post);
};
