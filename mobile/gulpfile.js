var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var jshint  = require('gulp-jshint');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('gulp-karma');

var paths = {
  src: ['src/**/*.*'],
  lib: ['lib/**/*.*'],
  scripts: ['!www/lib/**/*.js', 'www/**/*.js'],
  sass: ['./scss/**/*.scss']
};

var testFiles = [
  'www/lib/jsss/scramble_333.js',
  'www/lib/ionic/js/ionic.bundle.js',
  'www/lib/angular-mocks/angular-mocks.js',
  'www/lib/ngCordova/dist/ng-cordova.min.js',
  'www/lib/angular-timer/dist/angular-timer.js',
  'www/app/**/*.js',
  'www/components/**/*.js'
];

gulp.task('default', ['build', 'lint', 'sass', 'test', 'watch']);

gulp.task('ionic', ['build', 'lint', 'sass', 'test', 'watch'])

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run' //'watch'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('build', function() {
  gulp.src(paths.src)
    .pipe(gulp.dest('www'));
  gulp.src(paths.lib)
    .pipe(gulp.dest('www/lib'));
});
