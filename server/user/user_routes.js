'use strict';

var controller = require('./user_controllers.js')

module.exports = exports = function (router) {
  router.route('/:id/profile').get(controller.getProfile);
};
