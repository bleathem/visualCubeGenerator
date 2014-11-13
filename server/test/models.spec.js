'use strict';

process.env.NODE_ENV = 'test';
process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';

var mongoose = require('mongoose');
var should = require('should');
var config = require('../main/config');
var Solve = require('../solve/solve_model');
var User = require('../user/user_model');
var data = require('./test_data');

after(function(){
  mongoose.connection.close()
});

describe('Models:', function() {

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

  describe('solve', function() {
    describe('#create()', function() {
      it('should create a new Solve', function (done) {
        var solve = data.solve;
        Solve.create(solve, function(err, createdSolve) {
          if (err) {
            console.log(err);
          }
          should.not.exist(err);
          createdSolve.moves.should.equal(solve.moves);
          createdSolve.state.should.equal(solve.state);
          createdSolve.solveTime.should.equal(solve.solveTime);
          createdSolve.date.getTime().should.equal(solve.date);
          done();
        });
      });
    });
  });
  describe('user', function() {
    describe('#create()', function() {
      it('should create a new User', function (done) {
        var user = data.user;
        User.create(user, function(err, createdUser) {
          should.not.exist(err);
          createdUser.name.should.equal(user.name);
          done();
        });
      });
    });
  })
});
