/* jshint camelcase: false */
'use strict';
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  giveName: String,
  familyName: String,
  googleAccount: {
    kind: String,
    gender: String,
    sub: {
      type: String,
      unique: true
    },
    name: String,
    given_name: String,
    family_name: String,
    profile: String,
    picture: String,
    token: [{
        access_token: String,
        token_type: String,
        expiry: Date,
        refresh_token: String
      }]
  },
  created: {
    type: Date,
    default: Date.now
  }
});
module.exports = exports = mongoose.model('User', UserSchema);
