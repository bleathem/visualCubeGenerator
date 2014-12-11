/* jshint camelcase: false */
/* jshint expr: true */
'use strict';
process.env.NODE_ENV = 'test';
process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';
var request = require('supertest')
  , app = require('../main/app')
  , mongoose = require('mongoose')
  , data = require('./test_data')
  , User = require('../user/user_model')
  , Solve = require('../solve/solve_model')
  , _ = require('underscore')
  ;

require('should');

// mongoose.set('debug', true);
var user;
var headers = { Authorization: 'Bearer ' + data.user.googleAccount.token[0].access_token };
after(function () {
  mongoose.connection.close();
});
describe('Rest API:', function () {
  beforeEach(function (done) {
    function clearDB() {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function () {
        });
      }
      User.create(data.user, function (err, createdUser) {
        if (err) {
          console.log(err);
        }
        user = createdUser;
        done();
      });
    }
    return clearDB();
  });
  describe('GET /solve', function () {
    it('no more than 100 solves are returned', function (done) {
      var solvesToCreate = data.uniqueSolves(102, user);
      Solve.collection.insert(solvesToCreate, function () {
        request(app).get('/solve').set(headers).expect(200).end(function (err, res) {
          var solves = res.body;
          solves.length.should.equal(100);
          done();
        });
      });
    });
  });
  describe('POST /solve', function () {
    it('save a single solve without error', function (done) {
      request(app).post('/solve').set(headers).send({ solve: data.solve }).expect(200, done);
    });
  });
  describe('GET /category/solve', function() {
    beforeEach(function (done) {
      var solvesToCreate = data.uniqueSolves(10, user);
      solvesToCreate[5].category = 'testCategory';
      Solve.collection.insert(solvesToCreate, function () {
        done();
      });
    });

    it('return solves with empty category', function (done) {
      request(app).get('/solve').set(headers).expect(200).end(function (err, res) {
        var solves = res.body;
        solves.length.should.equal(9);
        done();
      });
    });

    it('return solves only with the right category', function (done) {
      request(app).get('/category/testCategory/solve').set(headers).expect(200).end(function (err, res) {
        var solves = res.body;
        solves.length.should.equal(1);
        done();
      });
    });

    it('return a 404 when the category is invalid', function (done) {
      request(app).get('/category/testCategory2/solve').set(headers).expect(404).end(function (err, res) {
        done();
      });
    });
  })
  describe('POST /solve/create_all', function () {
    it('save an array of solves without error', function (done) {
      var solves = data.uniqueSolves(2, user);
      Solve.find({}).exec().then(function (initialSolves) {
        var initialCount = initialSolves.length;
        request(app).post('/solve/create_all').set(headers).send({ solves: solves }).expect(200).end(function (err, res) {
          Solve.find({}).exec().then(function (finalSolves) {
            try {
              var finalCount = finalSolves.length;
              var result = res.body;
              result.created.length.should.equal(2);
              finalCount.should.equal(initialCount + solves.length);
              done();
            } catch (e) {
              done(e);
            }
          }, function (error) {
            console.log(error);
            done(error);
          });
        });
      });
    });
    it('fails when one solve in the array is invalid', function (done) {
      var solves = [
        { moves: 'RRL' },
        data.solve,
        { moves: 'LLRRL' }
      ];
      Solve.find({}).exec().then(function (initialSolves) {
        var initialCount = initialSolves.length;
        request(app).post('/solve/create_all').set(headers).send({ solves: solves }).expect(200).end(function (err, res) {
          Solve.find({}).exec().then(function (finalSolves) {
            try {
              var finalCount = finalSolves.length;
              var result = res.body;
              result.created.length.should.equal(1);
              result.failed.length.should.equal(2);
              finalCount.should.equal(initialCount + result.created.length);
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });
    });
  });
  describe('/category:', function () {
    describe('POST:', function () {
      it('save a new category to the db without error', function (done) {
        var newCategory = 'test';
        var url = '/category/' + newCategory;
        request(app)
          .post(url)
          .set(headers)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var updatedUser = res.body;
            updatedUser.categories.should.containEql(newCategory);
            var deleteUrl = '/category/' + newCategory;
            request(app)
              .delete(url)
              .set(headers)
              .expect(200)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                updatedUser = res.body;
                updatedUser.categories.should.not.containEql(newCategory);
                done();
              });
          });
      });
    });
  });
  describe('CSV down load', function () {
    it('download a csv file', function (done) {
      function csvParser(res, callback) {
        res.setEncoding('utf8');
        res.data = '';
        res.on('data', function (chunk) {
          res.data += chunk;
        });
        res.on('end', function () {
          callback(null, res.data);
        });
      }
      var solvesToCreate = data.uniqueSolves(102, user);
      Solve.collection.insert(solvesToCreate, function () {
        var csvHeaders = _.extend({ 'Accept': 'text/csv' }, headers);
        request(app).get('/solve?').set(csvHeaders).expect(200).expect('Content-Type', 'text/csv; charset=utf-8').parse(csvParser).end(function (err, res) {
          if (err) {
            return done(err);
          }
          var solvesCsv = res.body;
          solvesCsv.should.not.be.empty;
          solvesCsv.split('\n').length.should.equal(solvesToCreate.length + 2);
          done();
        });
      });
    });
  });
});
