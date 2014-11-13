'use strict';

var concat     = require('gulp-concat')
  , gulpif    = require('gulp-if')
  , refresh    = require('gulp-livereload')
  , plumber   = require('gulp-plumber')
  , gutil      = require('gulp-util')
  , templateCache = require('gulp-angular-templatecache')
  ;

module.exports = function(gulp, opts) {
  gulp.task('build-views', function() {
    gutil.log('... building views');
    return gulp.src(opts.paths.client.statics)
      .on('error', opts.errorHandler)
      .pipe(gulp.dest(opts.paths.client.target))
      .pipe(gulpif(opts.watching, plumber()))
      .pipe(gulpif(opts.watching, refresh(opts.browser)));
  });

  gulp.task('watch-views', function() {
    if (opts.watching) {
      gulp.watch(opts.paths.client.statics, ['build-views']);
    }
  })

  gulp.task('build-templates', function () {
    gutil.log('... building templates');
    return gulp.src(opts.paths.components.templates)
      .pipe(templateCache({
        module: opts.moduleName + '.template',
        standalone: true
      }))
      .pipe(gulp.dest(opts.paths.client.target))
      .pipe(gulpif(opts.watching, plumber()))
      .pipe(gulpif(opts.watching, refresh(opts.browser)));
  });

  gulp.task('watch-templates', function() {
    if (opts.watching) {
      gulp.watch(opts.paths.components.templates, ['build-templates']);
    }
  })
};
