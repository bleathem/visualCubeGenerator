'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint  = require('gulp-jshint');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('gulp-karma');
var del = require('del');
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');

var production = process.env.NODE_ENV === 'production';

var opts = {
  moduleName: 'visualCubeGenerator'
}

var paths = {
  src: ['src/**/!(*.js)', '!src/{scss,scss/**}'],
  scripts: ['src/**/*.js'],
  sass: ['./src/scss/**/*.scss'],
  fonts: ['lib/ionic/fonts/**/*.*']
};

var libs = [
  './lib/ionic/js/ionic.js',
  './lib/angular/angular.js',
  './lib/angular-animate/angular-animate.js',
  './lib/angular-sanitize/angular-sanitize.js',
  './lib/angular-ui-router/release/angular-ui-router.js',
  './lib/ionic/js/ionic-angular.js',
  './lib/angular-timer/dist/angular-timer.js',
  './lib/raphael/raphael.js',
  './lib/jsss/scramble_333.js',
  './lib/jsss/scramble_222.js',
  './lib/ngCordova/dist/ng-cordova.js'
];

gulp.task('build', ['lint', 'build-html', 'build-vendor', 'build-scripts', 'build-templates', 'build-fonts', 'build-sass']);

gulp.task('watch', ['watch-scripts', 'watch-sass']);

gulp.task('default', function(callback) {
  runSequence('clean', 'build', 'watch');
});

gulp.task('ionic',   ['default']);

gulp.task('clean', function(done) {
  del(['www/**'], function (err) {
    if (!err) {
      console.log('Files in www/ deleted');
    }
    done(err);
  });
});

gulp.task('build-html', function() {
  return gulp.src(paths.src)
    .pipe(gulp.dest('www'));
});

gulp.task('build-templates', function () {
  return gulp.src('../components/**/*.tpl.html')
    .pipe(templateCache({
      module: opts.moduleName + '.template',
      standalone: true
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('build-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('www/fonts'));
});

gulp.task('build-scripts', function () {
  gulp.src(['./src/**/*.js', '../components/**/*.js', '!../components/**/*.spec.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./www/'));
});

gulp.task('build-vendor', function() {
  gulp.src(libs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./www/'));
});

gulp.task('build-sass', ['build-fonts'], function(done) {
  gulp.src('./src/scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulpif(production, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('lint', function () {
  var config = {
    globals: {
      angular: true
    }
  };
  return gulp.src(paths.scripts.concat(['gulpfile.js', ]))
    .pipe(plumber())
    .pipe(jshint(config))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch-scripts', function() {
  return gulp.watch('./src/**/*.js', ['build-scripts']);
});

gulp.task('watch-sass', function() {
  return gulp.watch(paths.sass, ['build-sass']);
});

var errorHandler = function(error) {
  console.log(error.toString());
  this.emit('end');
};
