"use strict";

var Solve = require('./solve_model.js'),
    Q    = require('q');

var createAll = function(solves) {
  var deferred = Q.defer();

  var createRemaining = function(remaining, created, failed) {
    if (!remaining.length) {
      deferred.resolve({
        created: created,
        failed: failed
      })
      return;
    }
    var solve = remaining.shift();
    Solve.create(solve)
      .then(function(createdSolve) {
        created.push(createdSolve);
        createRemaining(remaining, created, failed);
      }, function(error) {
        failed.push(solve);
        createRemaining(remaining, created, failed);
      });
  };

  createRemaining(solves, [], []);
  return deferred.promise;
}

module.exports = exports = {
  listByUser: function(req, res, next) {
    Solve.find({_user: req.user.id}).sort({date: -1}).skip(0).limit(100).exec()
      .then(function (solves) {
        res.json(solves);
      }, function (reason) {
        next(reason);
      });
  },

  create: function(req, res, next) {
    var solve = req.body.solve;
    Solve.create(solve)
      .then(function (createdSolve) {
        res.send(createdSolve);
      }, function (reason) {
        next(reason);
      });
  },

  createAll: function(req, res, next) {
    var solves = req.body.solves;
    if (!solves || !(solves instanceof Array)) {
      throw new Error('Argument must be an array of solves');
    }
    createAll(solves)
      .then(function(result) {
        res.send(result);
      }, function (reason) {
        next(reason);
      });
  }
};
