'use strict';

var concat     = require('gulp-concat')
  , gulpif    = require('gulp-if')
  , plumber   = require('gulp-plumber')
  , templateCache = require('gulp-angular-templatecache')
  ;

module.exports = function(gulp, opts) {
  gulp.task('build-html', function() {
  return gulp.src(opts.paths.client.statics)
    .on('error', opts.errorHandler)
    .pipe(gulp.dest(opts.paths.client.target));
  });

  gulp.task('build-templates', function () {
    return gulp.src(opts.paths.components.templates)
      .pipe(templateCache({
        module: opts.moduleName + '.template',
        standalone: true
      }))
      .pipe(gulp.dest(opts.paths.client.target));
  });
};
