'use strict';

var nodemon = require('gulp-nodemon')
  , open    = require('open')
  , refresh = require('gulp-livereload')
  ;

var started = false;

module.exports = function(gulp, opts) {
  gulp.task('serve', function () {
    nodemon({
      script: 'server/server.js',
      ignore: ['**/node_modules/**/*.js'],
      watch: ['server'],
      nodeArgs: ['--debug'] 
      })
      .on('restart', function () {
        refresh(opts.browser);
      })
      .on('start', function() {
        if (started) {
          refresh(opts.browser);
        } else {
          started = true;
          setTimeout(function() {
              open('http://' + opts.frontend.hostname + ':' + opts.frontend.port);
            }, 500);
        }
      })
  });
};
