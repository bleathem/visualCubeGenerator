"use strict";

var User = require('./user_model.js'),
    Q    = require('q');

module.exports = exports = {
  get: function (req, res, next) {
    var $promise = Q.nbind(User.find, User);
    $promise()
      .then(function (users) {
        res.json(users);
      })
       .fail(function (reason) {
        next(reason);
      });
  },

  post: function (req, res, next) {
    var user = req.body.user;
    var $promise = Q.nbind(User.create, User);
    $promise(user)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  }
};
