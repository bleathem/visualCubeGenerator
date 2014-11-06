'use strict';

var gulpif     = require('gulp-if')
  , refresh    = require('gulp-livereload')
  , ngAnnotate = require('gulp-ng-annotate')
  , uglify     = require('gulp-uglify')
  , gutil      = require('gulp-util')
  , browserify = require('browserify')
  , buffer     = require('vinyl-buffer')
  , source     = require('vinyl-source-stream')
  , watchify   = require('watchify')
  ;

module.exports = function(gulp, opts) {
  gulp.task('browserify-scripts', function() {
    var b = browserify('./' + opts.paths.client.app);
    for (var lib in opts.libs.runtime) {
      b.external(lib);
    }
    if (opts.production) {
      return b.bundle().pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(opts.paths.client.target));
    }
    var bundler = watchify(b);

    function rebundle() {
      return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(opts.paths.client.target))
        .pipe(refresh(opts.browser));
    }

    bundler.on('update', rebundle);
    return rebundle();
  });

  gulp.task('browserify-vendor', function() {
    var b = browserify();
    for (var lib in opts.libs.runtime) {
      b.require(require.resolve('../' + opts.libs.runtime[lib]), {expose: lib});
    }
    return b.bundle().pipe(source('vendor.js'))
      .pipe(gulpif(opts.production, buffer()))
      .pipe(gulpif(opts.production, uglify()))
      .pipe(gulp.dest(opts.paths.client.target));
  });

};
