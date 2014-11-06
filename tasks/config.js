'use strict';

var ngConstant = require('gulp-ng-constant'),
    file = require('gulp-file');

var generateDevConstants = function() {
  var backend;
  var port = process.env.PORT || 9000;

  var rest = {
    protocol: process.env.REST_PROTOCOL || 'http',
    hostname: process.env.REST_HOSTNAME || 'localhost',
    port: process.env.REST_PORT || port
  };
  backend = rest.protocol + '://' + rest.hostname + ':' + rest.port;
  return {
    backend: backend,
    port: port
  }
}

module.exports = function(gulp, opts) {
  gulp.task('config', function () {
    file('config.nogit.json', '{}')
      .pipe(ngConstant({
        name: 'visualCubeGenerator.config',
        constants: {
          appConfig: generateDevConstants()
        }
      }))
      .pipe(gulp.dest(opts.paths.client.src + '/app/'));
  });
}
