'use strict';

var file       = require('gulp-file')
  , footer = require('gulp-footer')
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
    file(opts.paths.client.config, '{}')
      .pipe(ngConstant({
        name: 'visualCubeGenerator.config',
        constants: {
          appConfig: generateDevConstants(),
        },
        wrap: '// jshint quotmark: double \n<%= __ngModule %>'
      }))
      .pipe(footer(
        '\nvisualCubeGenerator.config([\'$compileProvider\', function ($compileProvider) {\n  $compileProvider.debugInfoEnabled(<%= debug %>);\n}]);\n',
        {debug: !opts.production}
      ))
      .pipe(gulp.dest(opts.paths.client.target + '/app/'));
  });
};
