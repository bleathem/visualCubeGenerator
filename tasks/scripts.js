'use strict';

var gulpif     = require('gulp-if')
  , refresh    = require('gulp-livereload')
  , ngAnnotate = require('gulp-ng-annotate')
  , plumber = require('gulp-plumber')
  , uglify     = require('gulp-uglify')
  , gutil      = require('gulp-util')
  , concat     = require('gulp-concat')
  ;

module.exports = function(gulp, opts) {
  var scriptSource = [opts.paths.client.app, opts.paths.client.scripts].concat(opts.paths.components.scripts);

  gulp.task('build-scripts', function () {
    gutil.log('... building scripts');
    return gulp.src(scriptSource)
      .pipe(concat('bundle.js'))

      .pipe(gulpif(opts.production, plumber()))
      .pipe(gulpif(opts.production, ngAnnotate()))
      .pipe(gulpif(opts.production, uglify()))

      .pipe(gulp.dest(opts.paths.client.target))

      .pipe(gulpif(opts.watching, plumber()))
      .pipe(gulpif(opts.watching, refresh(opts.browser)));
  });

  gulp.task('watch-scripts', function() {
    if (opts.watching) {
      gulp.watch(scriptSource, ['build-scripts']);
    }
  })

  gulp.task('build-vendor', function () {
    gulp.src(opts.libs.runtime)
      .pipe(concat('vendor.js'))

      .pipe(gulpif(opts.production, plumber()))
      .pipe(gulpif(opts.production, uglify()))

      .pipe(gulp.dest(opts.paths.client.target))
  });
};
