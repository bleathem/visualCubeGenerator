"use strict";

var mongoose = require('mongoose');

var SolveSchema = new mongoose.Schema({
  content: String,

  title: {
    type: String,
    required: true
  }
});

module.exports = exports = mongoose.model('solves', SolveSchema);
