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

var uniqueSolves = function(max, user) {
  var newSolves = [];
  var state = '';
  for (var i=0; i < max; i++) {
    state += 'L';
    var newSolve = {
      moves: solve.moves,
      state: state,
      solveTime: solve.solveTime,
      date: solve.date + i,
      _user: user._id,
    }
    newSolves.push(newSolve);
  }
  return newSolves;
}

module.exports = exports = {
  now: now,
  user: user,
  solve: solve,
  uniqueSolves: uniqueSolves
}
