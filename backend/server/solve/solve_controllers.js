"use strict";

var Solve = require('./solve_model.js'),
    Q    = require('q');

module.exports = exports = {
  get: function (req, res, next) {
    var $promise = Q.nbind(Solve.find, Solve);
    $promise()
      .then(function (solves) {
        debugger;
        res.json(solves);
      })
       .fail(function (reason) {
        next(reason);
      });
  },

  post: function (req, res, next) {
    var solve = req.body.solve;
    var $promise = Q.nbind(Solve.create, Solve);
    $promise(solve)
      .then(function (id) {
        res.send(id);
      })
      .fail(function (reason) {
        next(reason);
      });
  }
};
