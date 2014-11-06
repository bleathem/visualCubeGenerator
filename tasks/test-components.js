'use strict';

var karma      = require('gulp-karma')
  , gutil      = require('gulp-util')
  , browserify = require('browserify')
  , source     = require('vinyl-source-stream')
  , _          = require('underscore')
  ;

module.exports = function(gulp, opts) {
  require('./browserify')(gulp, opts);

  gulp.task('browserify-tests', function(done) {
    var externals = _.extend({}, opts.libs.runtime, opts.libs.test);
    gulp.src(opts.paths.components.specs)
      .pipe(gutil.buffer(function(err, files) {
        if (err) {
          opts.errorHandler(err);
        }
        var b = browserify();
        for (var external in externals) {
          b.external(external);
        }
        b.add(files);
        // number prefix ensures bundles are loaded in the correct run
        b.bundle()
          .pipe(source('2_tests.nogit.js'))
          .pipe(gulp.dest(opts.paths.components.target))
          .on('end', done);
      }));
  });

  gulp.task('browserify-vendor-tests', function() {
    var b = browserify();
    for (var lib in opts.libs.runtime) {
      b.external(lib);
    }
    for (var testLib in opts.libs.test) {
      b.require(require.resolve('../' + opts.libs.test[testLib]), {expose: testLib});
    }
    // number prefix ensures bundles are loaded in the correct order
    return b.bundle().pipe(source('1_vendor-tests.nogit.js'))
      .pipe(gulp.dest(opts.paths.components.target));
  });

  gulp.task('test-components', ['browserify-vendor', 'browserify-vendor-tests', 'browserify-tests'], function() {
    return gulp.src(opts.paths.components.tests)
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'run' //'run|watch'
      }))
      .on('error', opts.errorHandler);
  });
};
