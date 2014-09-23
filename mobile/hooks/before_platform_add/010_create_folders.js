#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
    console.log("Created folder " + path);
  } catch(e) {
    if ( e.code == 'EEXIST' ) {
      console.log("Folder '" + path + "' already exists.");
    } else {
      throw e;
    }
  }
}

console.log("Creating necessary directories...");
mkdirSync("platforms");
mkdirSync("plugins");
