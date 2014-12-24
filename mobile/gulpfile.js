'use strict';

var gulp = require('gulp')
  , connect = require('connect')
  , env = require('node-env-file')
  , open = require('open')
  , serveStatic = require('serve-static')
  , runSequence = require('run-sequence');

var envFile = process.env.NODE_ENV === 'production' ? 'production.env' : 'development.env';
env(__dirname + '/../env/' + envFile);

var paths = {
  client: {
    src: 'src',
    app: 'src/app/app.js',
    target: 'www',
    config: 'config.js',
    built: {
      scripts: 'www/**/*.js',
      styles: 'www/**/*.css',
      views: 'www/**/*.html'
    },
    statics: ['src/**/!(*.js)', '!src/{scss,scss/**}'],
    scripts: 'src/**/*.js',
    styles: {
      scss: ['src/scss/**/*.scss'],
      dest: 'www/css'
    },
    fonts: 'lib/ionic/release/fonts/**/*.*'
  },
  tasks: 'tasks/**/*.js',
  components: {
    scripts: ['../components/**/*.js', '!../components/**/*.spec.js'],
    templates: '../components/**/*.tpl.html',
    specs: '../components/**/*.js',
    styles: '../components/**/*.css',
    resources: ['../components/**/*.*', '!../components/**/*.js', '!../components/**/*.css']
  },
  data: process.cwd() + '/data'
};

var libs = {
  runtime: [
    './lib/ionic/release/js/ionic.js',
    './lib/angular/angular.js',
    './lib/rxjs/dist/rx.lite.js',
    './lib/angular-animate/angular-animate.js',
    './lib/angular-sanitize/angular-sanitize.js',
    './lib/angular-ui-router/release/angular-ui-router.js',
    './lib/ionic/release/js/ionic-angular.js',
    './lib/angular-timer/dist/angular-timer.js',
    './lib/raphael/raphael.js',
    './lib/jsss/scramble_333.js',
    './lib/jsss/scramble_222.js',
    './lib/ngCordova/dist/ng-cordova.js',
    './lib/angulartics/src/angulartics.js',
    './lib/angulartics/src/angulartics-ga-cordova.js',
    './lib/angular-rx/dist/rx.angular.js'
  ]
};

var opts = {
  moduleName: 'visualCubeGenerator',
  paths: paths,
  libs: libs,
  production: process.env.NODE_ENV === 'production',
  frontend: {
    hostname: 'localhost', // the mobile app only uses this when in dev mode
    port: 8000,
  },
  rest: {
    protocol: process.env.REST_PROTOCOL || 'http',
    hostname: process.env.REST_HOSTNAME || 'localhost',
    port: process.env.REST_PORT || port
  },
  lrPort: 35729,
  watching: false,
  errorHandler: function (error) {
    console.log(error.toString());
    this.emit('end');
  }
}

require('../tasks/angular-config.js')(gulp, opts);
require('../tasks/build.js')(gulp, opts);
require('../tasks/lint.js')(gulp, opts);
require('../tasks/scripts.js')(gulp, opts);
require('../tasks/styles.js')(gulp, opts);
require('../tasks/test-components.js')(gulp, opts);
require('../tasks/views.js')(gulp, opts);
require('../tasks/watch.js')(gulp, opts);


gulp.task('default', function(callback) {
  runSequence(['clean'], ['lint', 'build'], ['livereload-start', 'serve'], 'watch');
});

gulp.task('test', function(callback) {
  runSequence('clean', ['lint', 'build'], 'run-tests');
});

gulp.task('build-production', function(callback) {
  runSequence('clean', 'build');
});

gulp.task('build', ['angular-config', 'build-views', 'build-vendor', 'build-scripts', 'build-templates', 'build-fonts', 'build-styles', 'copy-resources']);

gulp.task('run-tests', ['test-components', 'test-backend']);

gulp.task('watch', ['watch-scripts', 'watch-styles', 'watch-views', 'watch-templates']);

gulp.task('ionic',   ['build-production']);

gulp.task('serve', function () {
  var app = connect()
      .use(serveStatic(opts.paths.client.target))
      .listen(opts.frontend.port);
  console.log("Listening on port " + opts.frontend.port)
  open('http://' + opts.frontend.hostname + ':'+opts.frontend.port);
});
