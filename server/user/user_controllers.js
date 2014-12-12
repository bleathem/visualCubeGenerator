/* jshint camelcase: false */
'use strict';
var User = require('./user_model.js')
  ;
module.exports = exports = {
  list: function (req, res, next) {
    User.find().exec().then(function (users) {
      res.json(users);
    }, function (reason) {
      next(reason);
    });
  },
  getProfile: function (req, res, next) {
    User.findById(
      req.params.id,
      { 'googleAccount.token': 0,  'googleAccount.email': 0  }
    ).exec().then(function (user) {
      if (!user) {
        next('No profile found');
        return;
      }
      res.json(user);
    }, function (reason) {
      next(reason.message);
    });
  },
  update: function (req, res, next) {
    var user = req.body.user;
    User.update({ _id: req.params.user_id }, user).exec().then(function (numAffected) {
      res.json(numAffected);
    }, function (reason) {
      next(reason);
    });
  },
  create: function (req, res, next) {
    var user = req.body.user;
    User.create(user).then(function (id) {
      res.send(id);
    }, function (reason) {
      next(reason);
    });
  }
};
