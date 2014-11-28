'use strict';

var jshint  = require('gulp-jshint')
  , plumber = require('gulp-plumber')
  ;

module.exports = function(gulp, opts) {
  gulp.task('lint', function () {
    var config = {
      laxcomma: true,
      globals: {
        angular: true
      }
    };
    var source = [].concat(opts.paths.client.scripts, opts.paths.tasks, opts.paths.components.scripts, opts.paths.server.scripts);
    console.log(source);
    return gulp.src(source)
      .pipe(plumber())
      .pipe(jshint(config))
      .pipe(jshint.reporter('jshint-stylish'));
  });

};
