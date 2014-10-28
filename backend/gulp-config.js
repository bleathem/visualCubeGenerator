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

  if (process.env.BACKEND_HOSTNAME) {
    backend = 'https://' + BACKEND_HOSTNAME;
  } else {
    backend = 'http://localhost:' + port;
  }
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
    .pipe(gulp.dest('client/app/'));
});
