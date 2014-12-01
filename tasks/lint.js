'use strict';

var jshint  = require('gulp-jshint')
  , plumber = require('gulp-plumber')
  ;

module.exports = function(gulp, opts) {
  gulp.task('lint', ['lint-tests'], function () {
    var config = {
      laxcomma: true,
      camelcase: false,
      globals: {
        angular: true
      }
    };
    var source = [].concat(opts.paths.client.scripts, opts.paths.tasks, opts.paths.components.scripts);
    if (opts.paths.server && opts.paths.server.scripts) {
      source.concat(opts.paths.server.scripts);
    }
    return gulp.src(source)
      .pipe(plumber())
      .pipe(jshint(config))
      .pipe(jshint.reporter('jshint-stylish'));
  });

  gulp.task('lint-tests', function () {
    var config = {
      laxcomma: true,
      globals: {
        angular: true,
        after: true,
        describe: true,
        beforeEach: true,
        it: true,
        should: true,
        expect: true
      }
    };
    var source = [opts.paths.components.specs];
    if (opts.paths.server && opts.paths.server.tests) {
      source.concat(opts.paths.server.tests);
    }
    return gulp.src(source)
      .pipe(plumber())
      .pipe(jshint(config))
      .pipe(jshint.reporter('jshint-stylish'));
  });

};
