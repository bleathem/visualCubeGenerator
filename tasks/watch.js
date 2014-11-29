'use strict';

var embedlr = require('gulp-embedlr')
  ;

module.exports = function(gulp, opts) {
  require('./lint.js')(gulp, opts);

  gulp.task('watch-enable', function () {
    opts.watching = true;
    return gulp.src(opts.paths.client.target + '/index.html')
      .pipe(embedlr({
        port: opts.lrPort
      }))
      .pipe(gulp.dest(opts.paths.client.target));
  });

  gulp.task('live', function () {
    opts.browser.listen(opts.lrPort, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  });
};
