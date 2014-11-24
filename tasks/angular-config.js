'use strict';

var footer = require('gulp-footer')
  , header = require('gulp-header')
  , ngConstant = require('gulp-ng-constant')
  ;

var generateDevConstants = function(opts) {
  var backend, frontend;
  var port = process.env.PORT || 9000;

  backend = opts.rest.protocol + '://' + opts.rest.hostname + ':' + opts.rest.port;
  frontend = 'http://' + opts.frontend.hostname + ':' + opts.frontend.port;
  return {
    backend: backend,
    frontend: frontend,
    port: opts.frontend.port
  };
};

module.exports = function(gulp, opts) {
  gulp.task('angular-config', function () {
    return gulp.src(opts.paths.client.src + '/app/' + opts.paths.client.config)
      .pipe(ngConstant({
        name: 'visualCubeGenerator.config',
        constants: {
          appConfig: generateDevConstants(opts),
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
