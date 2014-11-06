'use strict';
var gulp    = require('gulp')
  , gutil = require('gulp-util')
  , bower   = require('gulp-bower')
  , jshint  = require('gulp-jshint')
  , refresh = require('gulp-livereload')
  // , notify  = require('gulp-notify')
  ,  plumber = require('gulp-plumber')
  , client  = require('tiny-lr')()
  , nodemon = require('gulp-nodemon')
  , karma = require('gulp-karma')
  , lr_port = 35729
  , sass   = require('gulp-ruby-sass')
  , minifyCss = require('gulp-minify-css')
  , mocha = require('gulp-spawn-mocha')
  , exec = require('child_process').exec
  , env = require('node-env-file')
  , glob = require('glob')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , transform = require('vinyl-transform')
  , ngconstant = require('./gulp-config.js')
  , del = require('del')
  , runSequence = require('run-sequence')
  , gulpif = require('gulp-if')
  , uglify = require('gulp-uglify')
  , ngAnnotate = require('gulp-ng-annotate');

var production = process.env.NODE_ENV === 'production';

var paths = {
  src: ['client/src/**/!(*.js)', '!client/src/{scss,scss/**}'],
  scripts: ['client/src/**/*.js'],
  views: ['client/**/*.html', 'client/index.html'],
  styles: {
    css: ['client/www/**/*.css'],
    scss: ['client/src/scss/**/*.scss'],
    dest: 'client/www/css'
  },
  tests: ['server/test/**/*.spec.js'],
  fonts: ['lib/fontawesome/fonts/**'],
  components: {
    scripts: ['components/**/*.spec.js']
  }
};

var libs = {
  "angular": "./lib/angular/angular.js",
  "angular-ui-router": "./lib/angular-ui-router/release/angular-ui-router.js",
  "angular-timer": "./lib/angular-timer/dist/angular-timer.js",
  "raphael": "./lib/raphael/raphael.js",
  "scramble_333": "./lib/jsss/scramble_333.js",
  "scramble_222": "./lib/jsss/scramble_222.js",
  "ui-bootstrap": "./lib/angular-bootstrap/ui-bootstrap.js",
  "ui-bootstrap-tpls": "./lib/angular-bootstrap/ui-bootstrap-tpls.js",
  "ng-fx": "./lib/ngFx/dist/ngFx.js"
}

var testFiles = [
  'client/www/vendor.js',
  'components/vendor-tests.nogit.js',
  'components/tests.nogit.js'
];

var testLibs = {
  "angular-mocks": "./lib/angular-mocks/angular-mocks.js"
}

if (!production) {
  env(__dirname + '/env/development.env');
}

gulp.task('build', ['lint', 'build-html', 'browserify-vendor', 'build-fonts', 'sass']);

gulp.task('watch', ['watch-scripts', 'watch-sass']);

gulp.task('build-production', function(callback) {
  runSequence('clean', 'config', 'build-html', 'browserify-vendor', 'build-fonts', 'sass');
});

// gulp.task('default', ['build', 'testBackend', 'live', 'serve', 'watch']);

gulp.task('default', function(callback) {
  runSequence('clean', 'config', 'build', 'live', 'serve', 'watch-scripts', 'watch');
});

gulp.task('test', function(callback) {
  runSequence(['browserify-vendor', 'browserify-vendor-tests', 'browserify-tests'], 'run-browser-tests');
});


gulp.task('sass', function () {
  return gulp.src(paths.styles.scss)
    .pipe(plumber())
    .pipe(sass()).on('error', errorHandler)
    .pipe(gulpif(production, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(client));
    // .pipe(notify({message: 'Sass done'}));
});

gulp.task('bowerInstall', function  () {
  return bower().pipe();
});

gulp.task('html', function () {
  return gulp.src(paths.views)
    .pipe(plumber())
    .pipe(refresh(client));
    // .pipe(notify({message: 'Views refreshed'}));
});

gulp.task('css', function () {
  return gulp.src(paths.styles.css)
    .pipe(plumber())
    .pipe(refresh(client));
    // .pipe(notify({message: 'CSS refreshed'}));
});

gulp.task('lint', function () {
  var config = {
    browserify: true,
    globals: {
      angular: true
    }
  }
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint(config))
    .pipe(jshint.reporter('jshint-stylish'));
    // .pipe(refresh(client));
    // .pipe(notify({message: 'Lint done'}));
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
  client.listen(lr_port, function (err) {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.styles.sass, ['sass']);
  gulp.watch(paths.views, ['html']);
  gulp.watch(paths.scripts, ['lint']);
});

gulp.task('browserify-vendor', function() {
  var b = browserify();
  for (var lib in libs) {
    b.require(require.resolve(libs[lib]), {expose: lib});
  }
  return b.bundle().pipe(source('vendor.js'))
    .pipe(gulpif(production, buffer()))
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('./client/www/'));
})

gulp.task('browserify', function() {
  var b = browserify('./client/src/app/app.js');
  for (var lib in libs) {
    b.external(lib);
  }
  return b.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest('./client/www/'));
});

gulp.task('watch-scripts', function() {
  var b = browserify('./client/src/app/app.js');
  for (var lib in libs) {
    b.external(lib);
  }
  if (production) {
    return b.bundle().pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(gulp.dest('./client/www/'));
  }
  var bundler = watchify(b);
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./client/www'))
      .pipe(refresh(client));
  }

  return rebundle();
});

gulp.task('build-html', function() {
  console.log('build-html');
  return gulp.src(paths.src)
    .on('error', errorHandler)
    .pipe(gulp.dest('client/www'));
});

gulp.task('build-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('client/www/fonts'));
})

gulp.task('clean', function(done) {
  del(['client/www/**'], function (err) {
    if (!err) {
      console.log('Files in client/www/ deleted')
    };
    done(err);
  });
})

gulp.task('browserify-tests', function() {
  var b = browserify();
  for (var lib in libs) {
    b.external(lib);
  }
  for (var testLib in testLibs) {
    b.external(testLib);
  }
  gulp.src(paths.components.scripts)
    .pipe(gutil.buffer(function(err, files) {
      if (err) { (err); }
      b.add(files);
      b.bundle().pipe(source('tests.nogit.js'))
        .pipe(gulp.dest('./components'));
    }));
});

gulp.task('browserify-vendor-tests', function() {
  var b = browserify();
  for (var lib in libs) {
    b.external(lib);
  }
  for (var testLib in testLibs) {
    b.require(require.resolve(testLibs[testLib]), {expose: testLib});
  }
  return b.bundle().pipe(source('vendor-tests.nogit.js'))
    .pipe(gulp.dest('./components'));
})

gulp.task('run-browser-tests', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run' //'run|watch'
    }))
    .on('error', errorHandler);
});

gulp.task('testBackend', function () {
    return gulp.src(paths.tests, {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('mongo', function () {
  var dataFolder = process.cwd() + '/data';
  console.log(dataFolder);
  exec('mongod --dbpath ' + dataFolder, console.log);
})

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
