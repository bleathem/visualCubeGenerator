'use strict';

var gulp        = require('gulp')
  , runSequence = require('run-sequence');

var opts = require('./tasks/gulp-config.js')(gulp, {});

require('./tasks/angular-config.js')(gulp, opts);
require('./tasks/browserify.js')(gulp, opts);
require('./tasks/build.js')(gulp, opts);
require('./tasks/lint.js')(gulp, opts);
require('./tasks/mongo.js')(gulp, opts);
require('./tasks/server.js')(gulp, opts);
require('./tasks/test-backend.js')(gulp, opts);
require('./tasks/test-components.js')(gulp, opts);
require('./tasks/watch.js')(gulp, opts);

gulp.task('default', function(callback) {
  runSequence('clean', 'angular-config', 'build', 'live', 'serve', 'watch');
});

gulp.task('build', ['lint', 'build-html', 'browserify-vendor', 'browserify-scripts', 'build-fonts', 'build-sass']);

gulp.task('test', ['test-components', 'test-backend']);

gulp.task('watch', ['watch-built']);

gulp.task('build-production', function(callback) {
  runSequence('clean', 'angular-config', 'build-html', 'browserify-vendor', 'browserify-scripts', 'build-fonts', 'build-sass');
});
