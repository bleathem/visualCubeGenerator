'use strict';

/*
 *  A gulpfile used in deployment on OpenShift.
 *  Uses env variables to create an Angular.js config service
 */

var gulp    = require('gulp'),
    ngConstant = require('gulp-ng-constant'),
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

gulp.task('config', function () {
  file('config.nogit.json', '{}')
    .pipe(ngConstant({
      name: 'visualCubeGenerator.config',
      constants: {
        appConfig: generateDevConstants()
      }
    }))
    // Writes config.js to dist/ folder
    .pipe(gulp.dest('client/src/app/'));
});
