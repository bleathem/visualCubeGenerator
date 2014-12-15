/* jshint camelcase: false */
'use strict';
var User = require('./user_model.js')
  , Solve = require('../solve/solve_model.js')
  , averages = require('./averages')
  , ObjectId = (require('mongoose').Types.ObjectId)
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
      var sum = new averages.Seed();
      Solve.find({
          _user: new ObjectId(user._id),
          category: null
        })
        .sort({ date: -1 })
        .limit(10000)
        .stream()
        .on('data', function (solve) {
          sum = averages.sumSolveTimes(sum, solve);
        })
        .on('close', function () {
          averages.snapshotAverages(sum, 'all');
          res.json({user:user, averages: sum.averages});
        })
        .on('error', function (reason) {
          next(reason);
        });
    }, function (reason) {
      next(reason.message);
    });
  },
  getSolve: function (req, res, next) {
    User.findById(
      req.params.id,
      { 'googleAccount.token': 0,  'googleAccount.email': 0  }
    ).exec().then(function (user) {
      if (!user) {
        next('No profile found');
        return;
      }
      Solve.findOne({
          _id: new ObjectId(req.params.solveId),
          _user: new ObjectId(user._id)
        }).exec().then(function (solve) {
          res.json({user:user, solve:solve});
        }, function (reason) {
          next(reason.message);
        });
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
