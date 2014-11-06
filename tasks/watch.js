'use strict';

var refresh = require('gulp-livereload')
  , plumber = require('gulp-plumber')
  ;

module.exports = function(gulp, opts) {
  require('./lint.js')(gulp, opts);

  gulp.task('live', function () {
    opts.browser.listen(opts.lrPort, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });

  gulp.task('watch-built', function () {
    gulp.watch(opts.paths.client.built.styles, ['css']);
    gulp.watch(opts.paths.client.built.views, ['html']);
    gulp.watch(opts.paths.client.built.scripts, ['lint']);
  });

  gulp.task('html', function () {
    return gulp.src(opts.paths.client.built.views)
      .pipe(plumber())
      .pipe(refresh(opts.browser));
  });

  gulp.task('css', function () {
    return gulp.src(opts.paths.client.built.styles)
      .pipe(plumber())
      .pipe(refresh(opts.browser));
  });

};
