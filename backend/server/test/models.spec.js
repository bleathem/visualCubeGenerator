'use strict';

process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';
process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var should = require('should');
var config = require('../main/config');
var Solve = require('../solve/solve_model');

beforeEach(function (done) {

  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }

   return clearDB();
 }
);

afterEach(function (done) {
 mongoose.disconnect();
 return done();
});

describe('Models: solve', function () {
  describe('#create()', function () {
    it('should create a new Solve', function (done) {
      var now = new Date();
      var solve = {
        moves: "LRL",
        state: "FUD",
        solveTime: 2.123,
        created: now
      }
      Solve.create(solve, function(err, createdSolve) {
        should.not.exist(err);
        createdSolve.moves.should.equal(solve.moves);
        createdSolve.state.should.equal(solve.state);
        createdSolve.solveTime.should.equal(solve.solveTime);
        createdSolve.created.should.equal(now);
        done();
      })
    });
  });
});
