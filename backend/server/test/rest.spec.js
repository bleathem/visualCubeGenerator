'use strict';

process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';
process.env.NODE_ENV = 'test';

var request = require('supertest')
  , app = require('../main/app')
  , should = require('should');
  var mongoose = require('mongoose');

describe('Rest API:', function() {
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

  describe('POST /solve', function(){
    it('save to the db without error', function(done){
      var now = new Date();
      var solve = {
        moves: 'LRL',
        state: 'FUD',
        solveTime: 2.123,
        created: now
      }
      request(app)
        .post('/solve')
        .send(solve)
        .expect(200, done);
    });
  });


  describe('/user:', function(){
    describe('POST', function(){
      it('save to the db without error', function(done){
        var user = {
          'name': 'John Doe',
          'giveName': 'John',
          'familyName': 'Doe',
          'googleAccount': {
            'kind': 'plus#personOpenIdConnect',
            'gender': 'male',
            'sub': '123456789101112131415123',
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
        request(app)
          .post('/user')
          .send({user: user})
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            var createdUser = res.body;
            createdUser.name.should.equal(user.name);
            request(app)
              .get('/user')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                if (err) return done(err);
                var users = res.body;
                users.length.should.equal(1);
                var firstUser = users[0];
                firstUser.name.should.equal(user.name);
                firstUser._id.should.equal(createdUser._id);
                request(app)
                  .get('/user/' + createdUser._id)
                  .set('Accept', 'application/json')
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .end(function(err, res) {
                    if (err) return done(err);
                    var getUser = res.body;
                    getUser.name.should.equal(user.name);
                    getUser._id.should.equal(createdUser._id);
                    var newName = "Test2 Name";
                    request(app)
                      .put('/user/' + createdUser._id)
                      .send({user: {name: newName}})
                      .set('Accept', 'application/json')
                      .expect('Content-Type', /json/)
                      .expect(200)
                      .end(function(err, res) {
                        if (err) return done(err);
                        var numAffected = res.body[0];
                        numAffected.should.equal(1);
                        request(app)
                          .get('/user/' + createdUser._id)
                          .set('Accept', 'application/json')
                          .expect('Content-Type', /json/)
                          .expect(200)
                          .end(function(err, res) {
                            if (err) return done(err);
                            var getUser = res.body;
                            getUser.name.should.equal(newName);
                            getUser._id.should.equal(createdUser._id);
                            done();
                          });
                      });
                  });
              });
          });
      })
    });
  });
});