'use strict';

var gulpif        = require('gulp-if')
  , cached        = require('gulp-cached')
  , embedlr       = require('gulp-embedlr')
  , livereload    = require('gulp-livereload')
  , plumber       = require('gulp-plumber')
  , replace       = require('gulp-replace')
  , uglify        = require('gulp-uglify')
  , gutil         = require('gulp-util')
  , filter        = require('gulp-filter')
  , templateCache = require('gulp-angular-templatecache')
  ;

module.exports = function(gulp, opts) {
  gulp.task('enable-analytics', ['build-views'], function() {
    var index = opts.paths.client.target + '/index.html';
    var script = ['<script>'
      , '  (function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){'
      , '    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),'
      , '    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)'
      , '  })(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');'
      , '  ga(\'create\', \'UA-56918202-1\', \'auto\');'
      , '</script>'
    ].join('\n');
    if (!opts.production) {
      return;
    }
    return gulp.src(index)
    .pipe(replace(/.*<!-- replace-marker: anayltics -->/, script))
    .pipe(gulp.dest(opts.paths.client.target));
  });

  gulp.task('build-views', function() {
    gutil.log('... building views');
    var indexFilter = filter('index.html');
    return gulp.src(opts.paths.client.statics)
      .pipe(cached('views')) // only copy files that have changed
      .pipe(indexFilter)
      .pipe(gulpif(!opts.production, embedlr({
        port: opts.lrPort,
        src: 'http://localhost:' + opts.lrPort + '/livereload.js?snipver=1'
      })))
      .pipe(indexFilter.restore())
      .pipe(gulp.dest(opts.paths.client.target))
      .pipe(plumber())
      .pipe(livereload(opts.lr, {auto:false}))
      ;
  });

  gulp.task('watch-views', function() {
    gulp.watch(opts.paths.client.statics, ['build-views']);
  });

  gulp.task('build-templates', function () {
    gutil.log('... building templates');
    return gulp.src(opts.paths.components.templates)
      .pipe(templateCache({
        module: opts.moduleName + '.template',
        standalone: true
      }))

      .pipe(gulpif(opts.production, plumber()))
      .pipe(gulpif(opts.production, uglify()))

      .pipe(gulp.dest(opts.paths.client.target))
      .pipe(livereload(opts.lr, {auto:false}))
  });

  gulp.task('watch-templates', function() {
    gulp.watch(opts.paths.components.templates, ['build-templates']);
  });
};
