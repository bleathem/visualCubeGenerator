"use strict";

var mongoose = require('mongoose');

 var SolveSchema = new mongoose.Schema({
  moves: String,
  state: String,
  solveTime: Number,
  created: { type: Date, default: Date.now }
});

module.exports = exports = mongoose.model('Solve', SolveSchema);
