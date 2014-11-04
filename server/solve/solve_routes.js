"use strict";

var controller = require('./solve_controllers.js'),
    passport   = require('passport');

module.exports = exports = function (router) {
  router.route('/')
    .get(passport.authenticate('bearer', { session: false }), controller.listByUser)
    .post(passport.authenticate('bearer', { session: false }), controller.create);
  router.route('/create_all')
    .post(passport.authenticate('bearer', { session: false }), controller.createAll);
};
