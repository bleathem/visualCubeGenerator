'use strict';

process.env.DB_URL = 'mongodb://localhost/visualCubeGenerator-test';
process.env.NODE_ENV = 'test';

var request = require('supertest')
  , app = require('../main/app');

describe('GET /user', function(){
  it('respond with json', function(done){
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

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


describe('POST /user', function(){
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
      .send(user)
      .expect(200, done);
  })
})
