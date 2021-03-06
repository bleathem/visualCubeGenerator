'use strict';

var _ = require('underscore')
  ;

var paths = {
  client: {
    src: 'client/src',
    app: 'client/src/app/app.js',
    target: 'client/www',
    config: 'config.js',
    built: {
      scripts: 'client/www/**/*.js',
      styles: 'client/www/**/*.css',
      views: 'client/www/**/*.html'
    },
    statics: ['client/src/**/*.*','!client/src/**/*.js', '!client/src/{scss,scss/**}'],
    scripts: 'client/src/**/*.js',
    styles: {
      scss: ['client/src/scss/**/*.scss'],
      dest: 'client/www/css'
    },
    fonts: 'lib/fontawesome/fonts/**'
  },
  server: {
    scripts: ['server/**/*.js', '!server/**/*.spec.js'],
    tests: ['server/test/**/*.spec.js'],
  },
  tasks: 'tasks/**/*.js',
  components: {
    js: ['components/**/*.js'],
    scripts: ['components/**/*.js', '!components/**/*.spec.js'],
    templates: 'components/**/*.tpl.html',
    specs: 'components/**/*.spec.js',
    styles: 'components/**/*.css',
    resources: ['components/**/*.*', '!components/**/*.js', '!components/**/*.css']
  },
  data: process.cwd() + '/data'
};

var libs = {
  runtime: [
    './lib/angular/angular.js',
    './lib/rxjs/dist/rx.lite.js',
    './lib/angular-ui-router/release/angular-ui-router.js',
    './lib/angular-timer/dist/angular-timer.js',
    './lib/raphael/raphael.js',
    './lib/jsss/scramble_333.js',
    './lib/jsss/scramble_222.js',
    './lib/angular-bootstrap/ui-bootstrap.js',
    './lib/angular-bootstrap/ui-bootstrap-tpls.js',
    './lib/angulartics/src/angulartics.js',
    './lib/angulartics/src/angulartics-ga.js',
    './lib/angular-rx/dist/rx.angular.js',
    './client/src/ext/twitter-widget.js'
  ],
  test: [
    './lib/angular-mocks/angular-mocks.js'
  ]
};

var opts = {
  moduleName: 'visualCubeGenerator',
  paths: paths,
  libs: libs,
  production: process.env.NODE_ENV === 'production',
  lrPort: 35729 + 1,
  watching: false,
  frontend: {
    hostname: process.env.CLIENT_HOSTNAME || 'localhost',
    port: process.env.CLIENT_PORT || 9000
  },
  rest: {
    protocol: process.env.REST_PROTOCOL || 'http',
    hostname: process.env.REST_HOSTNAME || 'localhost',
    port: process.env.REST_PORT || process.env.PORT || 9000
  },
  errorHandler: function (error) {
    console.log(error.toString());
    this.emit('end');
  }
};

module.exports = function(gulp, baseOpts) {
  var newOpts = _.extend({}, baseOpts, opts);
  return newOpts;
};
