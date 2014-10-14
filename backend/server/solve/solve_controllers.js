"use strict";

var Solve = require('./solve_model.js'),
    Q    = require('q');

module.exports = exports = {
  listByUser: function (req, res, next) {
    Solve.find({_user: req.user.id}).exec()
      .then(function (solves) {
        debugger;
        res.json(solves);
      }, function (reason) {
        next(reason);
      });
  },

  post: function (req, res, next) {
    var solve = req.body.solve;
    Solve.create(solve)
      .then(function (id) {
        res.send(id);
      }, function (reason) {
        next(reason);
      });
  }
};
