'use strict';

var controller = require('./solve_controllers.js')
  , bewit = require('../bewit/bewit_controllers.js')
  , passport   = require('passport')
  ;

module.exports = exports = function (router) {
  router.use('/', passport.authenticate('bearer', { session: false }));
  router.use('/', function(req, res, next) {
    if (! req.params.category) {
      next();
      return;
    }
    var user = req.user;
    var category = req.params.category;
    user.categories = user.categories || [];
    if (user.categories.indexOf(category) >= 0) {
      req.category = category;
    } else {
      res.status(404).send('Category not found');
      return;
    }
    next();
  })
  router.route('/')
    .get(controller.listByUser)
    .post(controller.create);
  router.route('/:id')
    .delete(passport.authenticate('bearer', { session: false }), controller.delete);
  router.route('/create_all')
    .post(passport.authenticate('bearer', { session: false }), controller.createAll);
  router.route('/csv')
    .get(bewit.validateMac, controller.sendCsv);
};
