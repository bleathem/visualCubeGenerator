'use strict';

var paths = {
  client: {
    src: 'client/src',
    app: 'client/src/app/app.js',
    target: 'client/www',
    statics: ['client/src/**/!(*.js)', '!client/src/{scss,scss/**}'],
    scripts: ['client/src/**/*.js'],
    styles: {
      scss: ['client/src/scss/**/*.scss'],
      css: ['client/www/**/*.css'],
      dest: 'client/www/css'
    },
    fonts: ['lib/fontawesome/fonts/**'],
    views: ['client/www/**/*.html'],
  },
  server : {
    tests: ['server/test/**/*.spec.js'],
  },
  components: {
    specs: ['components/**/*.spec.js'],
    target: 'components/build',
    tests: ['client/www/vendor.js', 'components/build/**/*.js']
  }
};

var opts = {
  paths: paths,
  production: process.env.NODE_ENV === 'production',
  lr_port: 35729
}

var gulp        = require('gulp')
  , gulpif      = require('gulp-if')
  , jshint      = require('gulp-jshint')
  , karma       = require('gulp-karma')
  , refresh     = require('gulp-livereload')
  , minifyCss   = require('gulp-minify-css')
  , mocha       = require('gulp-mocha')
  , ngAnnotate  = require('gulp-ng-annotate')
  , nodemon     = require('gulp-nodemon')
  , plumber     = require('gulp-plumber')
  , sass        = require('gulp-ruby-sass')
  , uglify      = require('gulp-uglify')
  , gutil       = require('gulp-util')
  , browserify  = require('browserify')
  , exec        = require('child_process').exec
  , del         = require('del')
  , env         = require('node-env-file')
  , runSequence = require('run-sequence')
  , client      = require('tiny-lr')()
  , _           = require('underscore')
  , source      = require('vinyl-source-stream')
  , buffer      = require('vinyl-buffer')
  , watchify    = require('watchify')
  , ngconstant  = require('./tasks/config.js')(gulp, opts);

var libs = {
  runtime: {
    "angular": "./lib/angular/angular.js",
    "angular-ui-router": "./lib/angular-ui-router/release/angular-ui-router.js",
    "angular-timer": "./lib/angular-timer/dist/angular-timer.js",
    "raphael": "./lib/raphael/raphael.js",
    "scramble_333": "./lib/jsss/scramble_333.js",
    "scramble_222": "./lib/jsss/scramble_222.js",
    "ui-bootstrap": "./lib/angular-bootstrap/ui-bootstrap.js",
    "ui-bootstrap-tpls": "./lib/angular-bootstrap/ui-bootstrap-tpls.js",
    "ng-fx": "./lib/ngFx/dist/ngFx.js"
  },
  test: {
    "angular-mocks": "./lib/angular-mocks/angular-mocks.js"
  }
}

if (!opts.production) {
  env(__dirname + '/env/development.env');
}

gulp.task('build', ['lint', 'build-html', 'browserify-vendor', 'build-fonts', 'sass']);

gulp.task('watch', ['watch-scripts', 'watch-sass']);

gulp.task('build-production', function(callback) {
  runSequence('clean', 'config', 'build-html', 'browserify-vendor', 'build-fonts', 'sass');
});

gulp.task('default', function(callback) {
  runSequence('clean', 'config', 'build', 'live', 'serve', 'watch-scripts', 'watch');
});

gulp.task('test', function(callback) {
  runSequence(['browserify-vendor', 'browserify-vendor-tests', 'browserify-tests'], 'test-components');
});


gulp.task('sass', function () {
  return gulp.src(opts.paths.client.styles.scss)
    .pipe(plumber())
    .pipe(sass()).on('error', errorHandler)
    .pipe(gulpif(opts.production, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(gulp.dest(opts.paths.client.styles.dest))
    .pipe(refresh(client));
});

gulp.task('html', function () {
  return gulp.src(opts.paths.client.views)
    .pipe(plumber())
    .pipe(refresh(client));
});

gulp.task('css', function () {
  return gulp.src(opts.paths.client.styles.css)
    .pipe(plumber())
    .pipe(refresh(client));
});

gulp.task('lint', function () {
  var config = {
    browserify: true,
    globals: {
      angular: true
    }
  }
  return gulp.src(opts.paths.client.scripts)
    .pipe(plumber())
    .pipe(jshint(config))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('serve', function () {
  nodemon({
    script: 'server/server.js',
    ignore: ['**/node_modules/**/*.js'],
    watch: ['server']
    })
    .on('restart', function () {
      refresh(client);
    });
});

gulp.task('live', function () {
  client.listen(opts.lr_port, function (err) {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(opts.paths.client.styles.sass, ['sass']);
  gulp.watch(opts.paths.client.views, ['html']);
  gulp.watch(opts.paths.client.scripts, ['lint']);
});

gulp.task('browserify-vendor', function() {
  var b = browserify();
  for (var lib in libs.runtime) {
    b.require(require.resolve(libs.runtime[lib]), {expose: lib});
  }
  return b.bundle().pipe(source('vendor.js'))
    .pipe(gulpif(opts.production, buffer()))
    .pipe(gulpif(opts.production, uglify()))
    .pipe(gulp.dest(opts.paths.client.target))
})

gulp.task('browserify', function() {
  var b = browserify('./' + opts.paths.client.app);
  for (var lib in libs.runtime) {
    b.external(lib);
  }
  return b.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest(opts.paths.client.target));
});

gulp.task('watch-scripts', function() {
  var b = browserify('./' + opts.paths.client.app);
  for (var lib in libs.runtime) {
    b.external(lib);
  }
  if (opts.production) {
    return b.bundle().pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(gulp.dest(opts.paths.client.target));
  }
  var bundler = watchify(b);
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(opts.paths.client.target))
      .pipe(refresh(client));
  }

  return rebundle();
});

gulp.task('build-html', function() {
  console.log('build-html');
  return gulp.src(opts.paths.client.statics)
    .on('error', errorHandler)
    .pipe(gulp.dest(opts.paths.client.target));
});

gulp.task('build-fonts', function() {
  return gulp.src(opts.paths.client.fonts)
    .pipe(gulp.dest(opts.paths.client.target+'/fonts'));
})

gulp.task('clean', function(done) {
  var paths = [opts.paths.client.target + '/**', opts.paths.components.target + '/**']
  del(paths, function (err) {
    if (!err) {
      paths.forEach(function(path) {
        console.log('Files in "' + path + '" deleted')
      })
    };
    done(err);
  });
})

gulp.task('browserify-tests', function(done) {
  var externals = _.extend({}, libs.runtime, libs.test);
  gulp.src(opts.paths.components.specs)
    .pipe(gutil.buffer(function(err, files) {
      if (err) { (err); }
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
  for (var lib in libs.runtime) {
    b.external(lib);
  }
  for (var testLib in libs.test) {
    b.require(require.resolve(libs.test[testLib]), {expose: testLib});
  }
  // number prefix ensures bundles are loaded in the correct order
  return b.bundle().pipe(source('1_vendor-tests.nogit.js'))
    .pipe(gulp.dest(opts.paths.components.target));
})

gulp.task('test-components', function() {
  return gulp.src(opts.paths.components.tests)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run' //'run|watch'
    }))
    .on('error', errorHandler);
});

gulp.task('test-backend', function () {
    return gulp.src(opts.paths.server.tests, {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('mongo', function () {
  var dataFolder = process.cwd() + '/data';
  console.log(dataFolder);
  exec('mongod --dbpath ' + dataFolder, console.log);
})

// Handle errors
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
