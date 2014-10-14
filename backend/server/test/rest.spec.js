'use strict';

process.env.NODE_ENV = 'test';
process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';

var request = require('supertest')
  , app = require('../main/app')
  , should = require('should')
  , mongoose = require('mongoose')
  , data = require('./test_data')
  , User = require('../user/user_model');

var user;

describe('Rest API:', function() {

  beforeEach(function (done) {
    function clearDB() {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      User.create(data.user, function(err, createdUser) {
        if (err) {
          console.log(err);
        }
        user = createdUser;
        done();
      });
    }

     return clearDB();
   }
  );

  describe('POST /solve', function(){
    it('save to the db without error', function(done){
      var headers = {Authorization: 'Bearer ' + data.user.googleAccount.token.access_token};
      request(app)
        .post('/solve')
        .set(headers)
        .send({solve: data.solve})
        .expect(200, done);
    });
  });


  describe.skip('/user:', function(){
    describe('POST', function(){
      it('save to the db without error', function(done){
        var user = data.user;
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
                        var numAffected = res.body;
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
