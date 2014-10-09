"use strict";

var controller = require('./user_controllers.js');

module.exports = exports = function (router) {
  router
    .get('/', controller.list)
    .post('/', controller.create)
    .get('/:user_id', controller.find)
    .put('/:user_id', controller.update);
};
