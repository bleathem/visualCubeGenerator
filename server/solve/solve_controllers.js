'use strict';
var Solve = require('./solve_model.js')
  , through = require('through')
  , Q = require('q')
  , _ = require('underscore')
  ;

var createAll = function (solves) {
  var deferred = Q.defer();
  var createRemaining = function (remaining, created, failed) {
    if (!remaining.length) {
      deferred.resolve({
        created: created,
        failed: failed
      });
      return;
    }
    var solve = remaining.shift();
    Solve.create(solve).then(function (createdSolve) {
      created.push(createdSolve);
      createRemaining(remaining, created, failed);
    }, function () {
      console.log(arguments);
      failed.push(solve);
      createRemaining(remaining, created, failed);
    });
  };
  createRemaining(solves, [], []);
  return deferred.promise;
};

module.exports = exports = {
  listByUser: function (req, res, next) {
    if (req.headers.accept === 'text/csv') {
      exports.sendCsv(req, res, next);
    } else {
      Solve.find({
          _user: req.user.id,
          category: req.category
        })
        .sort({ date: -1 })
        .skip(0).limit(100)
        .exec().then(function (solves) {
          res.json(solves);
        }, function (reason) {
          next(reason);
        });
    }
  },
  create: function (req, res, next) {
    var solve = req.body.solve;
    Solve.create(solve).then(function (createdSolve) {
      res.send(createdSolve);
    }, function (reason) {
      next(reason);
    });
  },
  createAll: function (req, res, next) {
    var solves = req.body.solves;
    if (!solves || !(solves instanceof Array)) {
      throw new Error('Argument must be an array of solves');
    }
    createAll(solves).then(function (result) {
      res.send(result);
    }, function (reason) {
      next(reason);
    });
  },
  sendCsv: function (req, res) {
    res.attachment('solves.csv');
    res.write('date, solveTime, moves, state\n');
    var template = _.template('<%= date %>, <%= solveTime %>, <%= moves %>, <%= state %>\n');
    Solve.find({ _user: req.query.user_id || req.user.id })
      .sort({ date: -1 })
      .limit(10000)
      .stream()
      .pipe(through(function (solve) {
        this.queue(template(solve));
      }))
      .pipe(res);
  },
  delete: function (req, res, next) {
    var query = req.params.id === 'all' ? {} : {_id: req.params.id};
    Solve.find(query).remove().exec().then(function() {
      res.send('All remote solves deleted.');
    }, function(error) {
      next(error);
    })
  }
};
