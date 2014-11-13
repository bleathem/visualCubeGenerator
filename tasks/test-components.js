'use strict';

var karma      = require('gulp-karma')
  , gutil      = require('gulp-util')
  ;

module.exports = function(gulp, opts) {
  gulp.task('test-components', function() {
    var files = [opts.paths.client.target + '/vendor.js'].concat(
      opts.libs.test,
      [
        opts.paths.components.specs,
        opts.paths.client.src + '/app/config.nogit.js'
      ]
    );
    return gulp.src(files)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run' //'run|watch'
      }))
      .on('error', opts.errorHandler);
  });
};
