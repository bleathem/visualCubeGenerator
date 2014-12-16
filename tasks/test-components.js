'use strict';

var karma      = require('gulp-karma')
  ;

module.exports = function(gulp, opts) {
  gulp.task('test-components', function() {
    var files = [opts.paths.client.target + '/js/vendor.js'].concat(
      opts.libs.test,
      opts.paths.components.js,
      opts.paths.client.target + '/app/' + opts.paths.client.config
    );
    console.log(files);
    return gulp.src(files)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run' //'run|watch'
      }))
      .on('error', opts.errorHandler);
  });
};
