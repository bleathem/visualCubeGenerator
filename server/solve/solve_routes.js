'use strict';

var controller = require('./solve_controllers.js')
  , bewit = require('../bewit/bewit_controllers.js')
  , passport   = require('passport')
  ;

module.exports = exports = function (router) {
  router.route('/')
    .get(passport.authenticate('bearer', { session: false }), controller.listByUser)
    .post(passport.authenticate('bearer', { session: false }), controller.create)
  router.route('/:id')
    .delete(passport.authenticate('bearer', { session: false }), controller.delete);
  router.route('/create_all')
    .post(passport.authenticate('bearer', { session: false }), controller.createAll);
  router.route('/csv')
    .get(bewit.validateMac, controller.sendCsv);
};
