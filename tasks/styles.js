'use strict';

var concat     = require('gulp-concat')
  , livereload = require('gulp-livereload')
  , gulpif    = require('gulp-if')
  , minifyCss = require('gulp-minify-css')
  , plumber   = require('gulp-plumber')
  , rename    = require('gulp-rename')
  , sass      = require('gulp-ruby-sass')
  , gutil      = require('gulp-util')
  , mergeStream =require('merge-stream')
  ;

module.exports = function(gulp, opts) {
    gutil.log('... building styles');
  gulp.task('build-styles', function () {
    var appCss = gulp.src(opts.paths.client.styles.scss)
      .pipe(plumber())
      .pipe(sass()).on('error', opts.errorHandler)
      .pipe(gulpif(opts.production, minifyCss({
        keepSpecialComments: 0
      })));
    var componentCss = gulp.src(opts.paths.components.styles);
    return mergeStream(appCss, componentCss)
      .pipe(concat('app.css'))

      .pipe(gulpif(opts.production, plumber()))
      .pipe(gulpif(opts.production, minifyCss()))

      .pipe(gulp.dest(opts.paths.client.styles.dest))
      .pipe(livereload(opts.lr, {auto:false}))
  });

  gulp.task('watch-styles', function() {
    var styleSource = [opts.paths.client.styles.scss, opts.paths.components.styles];
    gulp.watch(styleSource, ['build-styles']);
  });

  gulp.task('copy-resources', function() {
    return gulp.src(opts.paths.components.resources)
      .pipe(rename({
        dirname: ''
      }))
      .pipe(gulp.dest(opts.paths.client.target+'/css'));
  });

  gulp.task('build-fonts', function() {
    return gulp.src(opts.paths.client.fonts)
      .pipe(gulp.dest(opts.paths.client.target+'/fonts'));
  });
};
