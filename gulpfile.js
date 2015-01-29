'use strict';

var gulp        = require('gulp')
  , env = require('node-env-file')
  , runSequence = require('run-sequence');

var envFile = process.env.NODE_ENV === 'production' ? 'production.env' : 'development.env';
env(__dirname + '/env/' + envFile);

var opts = require('./tasks/gulp-config.js')(gulp, {});

require('./tasks/angular-config.js')(gulp, opts);
require('./tasks/build.js')(gulp, opts);
require('./tasks/lint.js')(gulp, opts);
require('./tasks/mongo.js')(gulp, opts);
require('./tasks/scripts.js')(gulp, opts);
require('./tasks/server.js')(gulp, opts);
require('./tasks/styles.js')(gulp, opts);
require('./tasks/test-backend.js')(gulp, opts);
require('./tasks/test-components.js')(gulp, opts);
require('./tasks/views.js')(gulp, opts);
require('./tasks/watch.js')(gulp, opts);

gulp.task('default', function(callback) {
  runSequence(['clean', 'livereload-start'], ['lint', 'build'], ['serve'], 'watch');
});

gulp.task('test', function(callback) {
  runSequence('clean', ['lint', 'build'], 'run-tests');
});

gulp.task('build-production', function(callback) {
  runSequence('clean', 'build');
});

gulp.task('build', ['angular-config', 'build-views', 'enable-analytics', 'build-vendor', 'build-scripts', 'build-templates', 'build-fonts', 'build-styles', 'copy-resources']);

gulp.task('run-tests', ['test-components', 'test-backend']);

gulp.task('watch', ['watch-scripts', 'watch-styles', 'watch-views', 'watch-templates']);
