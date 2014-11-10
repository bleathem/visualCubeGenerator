'use strict';

var jshint  = require('gulp-jshint')
  , plumber = require('gulp-plumber')
  ;

module.exports = function(gulp, opts) {
  gulp.task('lint', function () {
    var config = {
      browserify: true,
      laxcomma: true,
      globals: {
        angular: true
      }
    };
    var source = opts.paths.client.scripts.concat([opts.paths.tasks], opts.paths.components.scripts);
    return gulp.src(source)
      .pipe(plumber())
      .pipe(jshint(config))
      .pipe(jshint.reporter('jshint-stylish'));
  });

};
