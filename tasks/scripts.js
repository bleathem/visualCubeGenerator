'use strict';

var gulpif     = require('gulp-if')
  , refresh    = require('gulp-livereload')
  , ngAnnotate = require('gulp-ng-annotate')
  , uglify     = require('gulp-uglify')
  , gutil      = require('gulp-util')
  , concat     = require('gulp-concat')
  ;

module.exports = function(gulp, opts) {
  gulp.task('build-scripts', function () {
    gulp.src([opts.paths.client.app, opts.paths.client.scripts].concat(opts.paths.components.scripts))
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(opts.paths.client.target))
  });

  gulp.task('build-vendor', function () {
    gulp.src(opts.libs.runtime)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(opts.paths.client.target))
  });
};
