'use strict';

var concat     = require('gulp-concat')
  , gulpif    = require('gulp-if')
  , minifyCss = require('gulp-minify-css')
  , plumber   = require('gulp-plumber')
  , rename    = require('gulp-rename')
  , sass      = require('gulp-ruby-sass')
  , mergeStream =require('merge-stream')
  ;

module.exports = function(gulp, opts) {
  gulp.task('build-sass', function () {
    var appCss = gulp.src(opts.paths.client.styles.scss)
      .pipe(plumber())
      .pipe(sass()).on('error', opts.errorHandler)
      .pipe(gulpif(opts.production, minifyCss({
        keepSpecialComments: 0
      })));
    var componentCss = gulp.src(opts.paths.components.styles);
    mergeStream(appCss, componentCss)
      .pipe(concat('app.css'))
      .pipe(gulp.dest(opts.paths.client.styles.dest));
  });

  gulp.task('copy-resources', function() {
    return gulp.src(opts.paths.components.resources)
      .pipe(rename({
        dirname: ''
      }))
      .pipe(gulp.dest(opts.paths.client.target+'/css'));
  })

  gulp.task('build-fonts', function() {
    return gulp.src(opts.paths.client.fonts)
      .pipe(gulp.dest(opts.paths.client.target+'/fonts'));
  });
};
