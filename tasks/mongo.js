'use strict';

var exec = require('child_process').exec
  ;

module.exports = function(gulp, opts) {
  gulp.task('mongo', function () {
    console.log(opts.paths.data);
    exec('mongod --dbpath ' + opts.paths.data, console.log);
  });
};
