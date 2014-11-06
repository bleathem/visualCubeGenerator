'use strict';

var nodemon = require('gulp-nodemon')
  , refresh     = require('gulp-livereload')
  ;

module.exports = function(gulp, opts) {
  gulp.task('serve', function () {
    nodemon({
      script: 'server/server.js',
      ignore: ['**/node_modules/**/*.js'],
      watch: ['server']
      })
      .on('restart', function () {
        refresh(opts.browser);
      });
  });
};
