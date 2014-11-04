'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

 var SolveSchema = new mongoose.Schema({
  moves: {type: String, required: true},
  state: {type: String, required: true, unique: true},
  solveTime: {type: Number, required: true},
  date: {type: Date, required: true},
  _user: { type: ObjectId, required: true, index: true},
  created: { type: Date, default: Date.now }
});

module.exports = exports = mongoose.model('Solve', SolveSchema);
