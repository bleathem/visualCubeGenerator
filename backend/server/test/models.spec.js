'use strict';

process.env.NODE_ENV = 'test';
process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';

var mongoose = require('mongoose');
var should = require('should');
var config = require('../main/config');
var Solve = require('../solve/solve_model');
var User = require('../user/user_model');

process.env.DB_URL = '';

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
        var now = new Date();
        var solve = {
          moves: 'LRL',
          state: 'FUD',
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
        });
      });
    });
  });
  describe('user', function() {
    describe('#create()', function() {
      it('should create a new User', function (done) {
        var user = {
          'name': 'John Doe',
          'giveName': 'John',
          'familyName': 'Doe',
          'googleAccount': {
            'kind': 'plus#personOpenIdConnect',
            'gender': 'male',
            'sub': '123456789101112131415',
            'name': 'John Doe',
            'giveName': 'John',
            'familyName': 'Doe',
            'profile': 'https://plus.google.com/+JohnDoe',
            'picture': 'https://lh5.googleusercontent.com/-abcdefghij/AAAAAAAAAAA/AAAAAAAAAaa/AaBbCcDdEeFf/photo.jpg?sz=50',
            'token': {
              'access_token': 'aa11.aA123456bB78910-aA123456bB78910',
              'token_type': 'Bearer',
              'expires_in': '3600',
              'authuser': '0',
              'num_sessions': '2',
              'prompt': 'consent',
              'session_state': 'aA123456bB78910aA123456bB78910..1a12'
            }
          }
        }
        User.create(user, function(err, createdUser) {
          should.not.exist(err);
          createdUser.name.should.equal(user.name);
          done();
        });
      });
    });
  })
});
