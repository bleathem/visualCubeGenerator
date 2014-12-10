'use strict';

var controller = require('./category_controllers.js')
  , passport   = require('passport')
  ;

module.exports = exports = function (router) {
  router.use(passport.authenticate('bearer', { session: false }));
  router.route('/:category').post(controller.create);
  router.route('/:category').delete(controller.delete);
};
