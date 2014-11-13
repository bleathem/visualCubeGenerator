'use strict';

var gulpif    = require('gulp-if')
  , minifyCss = require('gulp-minify-css')
  , plumber   = require('gulp-plumber')
  , sass      = require('gulp-ruby-sass')
  , del       = require('del')
  , templateCache = require('gulp-angular-templatecache')
  ;

module.exports = function(gulp, opts) {
  gulp.task('clean', function(done) {
    var paths = [opts.paths.client.target + '/**', opts.paths.components.target + '/**'];
    del(paths, function (err) {
      if (!err) {
        paths.forEach(function(path) {
          console.log('Files in "' + path + '" deleted');
        });
      }
      done(err);
    });
  });

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

  gulp.task('build-sass', function () {
    return gulp.src(opts.paths.client.styles.scss)
      .pipe(plumber())
      .pipe(sass()).on('error', opts.errorHandler)
      .pipe(gulpif(opts.production, minifyCss({
        keepSpecialComments: 0
      })))
      .pipe(gulp.dest(opts.paths.client.styles.dest));
  });

  gulp.task('build-fonts', function() {
    return gulp.src(opts.paths.client.fonts)
      .pipe(gulp.dest(opts.paths.client.target+'/fonts'));
  });
};
