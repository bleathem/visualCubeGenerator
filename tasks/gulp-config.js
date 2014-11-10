'use strict';

var env = require('node-env-file')
  , _   = require('underscore')
  ;

var paths = {
  client: {
    src: 'client/src',
    app: 'client/src/app/app.js',
    target: 'client/www',
    built: {
      scripts: ['client/www/**/*.js'],
      styles: ['client/www/**/*.css'],
      views: ['client/www/**/*.html']
    },
    statics: ['client/src/**/!(*.js)', '!client/src/{scss,scss/**}'],
    scripts: ['client/src/**/*.js'],
    styles: {
      scss: ['client/src/scss/**/*.scss'],
      dest: 'client/www/css'
    },
    fonts: ['lib/fontawesome/fonts/**']
  },
  server: {
    tests: ['server/test/**/*.spec.js'],
  },
  tasks: 'tasks/**/*.js',
  components: {
    scripts: ['components/**/*.js', '!components/**/*.spec.js', '!components/build/**/*.js'],
    specs: ['components/**/*.spec.js'],
    target: 'components/build',
    tests: ['client/www/vendor.js', 'components/build/**/*.js']
  },
  data: process.cwd() + '/data'
};

var libs = {
  runtime: {
    'angular': './lib/angular/angular.js',
    'angular-ui-router': './lib/angular-ui-router/release/angular-ui-router.js',
    'angular-timer': './lib/angular-timer/dist/angular-timer.js',
    'raphael': './lib/raphael/raphael.js',
    'scramble_333': './lib/jsss/scramble_333.js',
    'scramble_222': './lib/jsss/scramble_222.js',
    'ui-bootstrap': './lib/angular-bootstrap/ui-bootstrap.js',
    'ui-bootstrap-tpls': './lib/angular-bootstrap/ui-bootstrap-tpls.js',
    'ng-fx': './lib/ngFx/dist/ngFx.js'
  },
  test: {
    'angular-mocks': './lib/angular-mocks/angular-mocks.js'
  }
};

var opts = {
  browser: require('tiny-lr')(),
  paths: paths,
  libs: libs,
  production: process.env.NODE_ENV === 'production',
  lrPort: 35729,
  errorHandler: function (error) {
    console.log(error.toString());
    this.emit('end');
  }
};

module.exports = function(gulp, baseOpts) {
  var newOpts = _.extend({}, baseOpts, opts);
  if (!newOpts.production) {
    env(__dirname + '/../env/development.env');
  }
  return newOpts;
};
