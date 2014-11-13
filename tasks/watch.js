'use strict';

var refresh = require('gulp-livereload')
  , plumber = require('gulp-plumber')
  ;

module.exports = function(gulp, opts) {
  require('./lint.js')(gulp, opts);

  gulp.task('watch-enable', function () {
    opts.watching = true;
  });

  gulp.task('live', function () {
    opts.browser.listen(opts.lrPort, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });
};
