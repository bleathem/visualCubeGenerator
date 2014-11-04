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
  , lr_port = 35729
  , sass   = require('gulp-sass')
  , minifyCss = require('gulp-minify-css')
  , mocha = require('gulp-spawn-mocha')
  , exec = require('child_process').exec
  , env = require('node-env-file')
  , browserify = require('browserify')
  , watchify = require('watchify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
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
  views: ['!client/lib/*.html', 'client/**/*.html', 'client/index.html'],
  styles: {
    css: ['client/www/**/*.css'],
    scss: ['client/src/scss/**/*.scss'],
    dest: 'client/www/css'
  },
  tests: ['server/test/**/*.spec.js'],
  fonts: ['client/lib/fontawesome/fonts/**']
};

var libs = {
  "angular": "./client/lib/angular/angular.js",
  "angular-ui-router": "./client/lib/angular-ui-router/release/angular-ui-router.js",
  "angular-timer": "./client/lib/angular-timer/dist/angular-timer.js",
  "raphael": "./client/lib/raphael/raphael.js",
  "scramble_333": "./client/lib/jsss/scramble_333.js",
  "scramble_222": "./client/lib/jsss/scramble_222.js",
  "ui-bootstrap": "./client/lib/angular-bootstrap/ui-bootstrap.js",
  "ui-bootstrap-tpls": "./client/lib/angular-bootstrap/ui-bootstrap-tpls.js",
  "ng-fx": "./client/lib/ngFx/dist/ngFx.js"
}

if (!production) {
  env(__dirname + '/env/development.env');
}

gulp.task('build', ['lint', 'build-html', 'browserify-vendor', 'build-fonts', 'sass']);

gulp.task('watch', ['watch-scripts', 'watch-sass']);

// gulp.task('default', ['build', 'testBackend', 'live', 'serve', 'watch']);

gulp.task('default', function(callback) {
  runSequence('clean', 'config', 'build', 'live', 'serve', 'watch-scripts', 'watch');
});

gulp.task('sass', function () {
  return gulp.src(paths.styles.scss)
    .pipe(plumber())
    .pipe(sass())
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
  nodemon({script: 'server/server.js', ignore: ['node_modules/**/*.js']})
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
  for (lib in libs) {
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
  return gulp.src(paths.src)
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

gulp.task('testBackend', function () {
    return gulp.src(paths.tests, {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('mongo', function () {
  var dataFolder = process.cwd() + '/data';
  console.log(dataFolder);
  exec('mongod --dbpath ' + dataFolder, console.log);
})
