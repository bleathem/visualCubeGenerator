'use strict';

var del       = require('del')
  ;

module.exports = function(gulp, opts) {
  gulp.task('clean', function(done) {
    var paths = [opts.paths.client.target + '/**', opts.paths.components.target + '/**'];
    del(paths, function (err) {
      if (!err) {
        paths.forEach(function(path) {
          console.log('Files in "' + path + '" deleted');
        });
      }
      done(err);
    });
  });
};
