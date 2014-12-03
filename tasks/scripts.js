'use strict';

var gulpif     = require('gulp-if')
  , livereload = require('gulp-livereload')
  , ngAnnotate = require('gulp-ng-annotate')
  , plumber = require('gulp-plumber')
  , sourcemaps = require('gulp-sourcemaps')
  , uglify     = require('gulp-uglify')
  , gutil      = require('gulp-util')
  , concat     = require('gulp-concat')
  ;

module.exports = function(gulp, opts) {
  require('./angular-config');
  var scriptSource = [
    opts.paths.client.app,
    opts.paths.client.scripts,
    opts.paths.client.target + '/app/' + opts.paths.client.config
  ].concat(opts.paths.components.scripts);

  gulp.task('build-scripts', ['angular-config'], function () {
    gutil.log('... building scripts');
    return gulp.src(scriptSource)
      .pipe(gulpif(!opts.production, sourcemaps.init()))
      .pipe(concat('bundle.js'))

      .pipe(gulpif(opts.production, plumber()))
      .pipe(gulpif(opts.production, ngAnnotate()))
      .pipe(gulpif(opts.production, uglify()))

      .pipe(gulpif(!opts.production, sourcemaps.write()))
      .pipe(gulp.dest(opts.paths.client.target))
      .pipe(livereload(opts.lr, {auto:false}))
      ;
  });

  gulp.task('watch-scripts', function() {
    gulp.watch(scriptSource, ['build-scripts']);
  });

  gulp.task('build-vendor', function () {
    gulp.src(opts.libs.runtime)
      .pipe(concat('vendor.js'))

      .pipe(gulpif(opts.production, plumber()))
      .pipe(gulpif(opts.production, uglify()))

      .pipe(gulp.dest(opts.paths.client.target));
  });
};
