'use strict';

var mongoose = require('mongoose');
var now = new Date().getTime();

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
    'token': [{
      'access_token': 'aa11.aA123456bB78910-aA123456bB78910',
      'token_type': 'Bearer',
      'expires': now + 3600,
      'authuser': '0',
      'num_sessions': '2',
      'prompt': 'consent',
      'session_state': 'aA123456bB78910aA123456bB78910..1a12'
    }]
  }
}

var solve = {
  moves: 'LRL',
  state: 'FUD',
  solveTime: 2.123,
  date: now,
  _user: mongoose.Types.ObjectId('123456789123456789123456'),
}

module.exports = exports = {
  now: now,
  user: user,
  solve: solve
}
