'use strict';

var footer = require('gulp-footer')
  , header = require('gulp-header')
  , ngConstant = require('gulp-ng-constant')
  ;

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
  };
};

module.exports = function(gulp, opts) {
  gulp.task('angular-config', function () {
    return gulp.src(opts.paths.client.src + '/app/' + opts.paths.client.config)
      .pipe(ngConstant({
        name: 'visualCubeGenerator.config',
        constants: {
          appConfig: generateDevConstants(),
        }
      }))
      .pipe(header('// jshint quotmark: double \n"use strict";\n(function (angular) {\n'))
      .pipe(footer(
        '\nangular.module("visualCubeGenerator").config(["$compileProvider", function ($compileProvider) {\n  $compileProvider.debugInfoEnabled && $compileProvider.debugInfoEnabled(<%= debug %>);\n}]);\n})(angular);\n// jshint quotmark: single\n',
        {debug: !opts.production}
      ))
      .pipe(gulp.dest(opts.paths.client.target + '/app/'));
  });
};
