"use strict";

var User = require('./user_model.js'),
    Q    = require('q');

module.exports = exports = {
  list: function (req, res, next) {
    var $promise = Q.nbind(User.find, User);
    $promise()
      .then(function (users) {
        res.json(users);
      })
       .fail(function (reason) {
        next(reason);
      });
  },

  find: function (req, res, next) {
    var $promise = Q.nbind(User.findById, User);
		$promise(req.params.user_id)
      .then(function (users) {
        res.json(users);
      })
       .fail(function (reason) {
        next(reason);
      });
	},

  update: function (req, res, next) {
    var user = req.body.user;
    var $promise = Q.nbind(User.update, User);
    $promise({_id: req.params.user_id}, user)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  },

  create: function (req, res, next) {
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
