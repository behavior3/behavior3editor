var gulp   = require('gulp');
var config = require('./config.js');

var mocha = require('gulp-mocha');
var utils = require('gulp-util');

gulp.task('_test_watch', function() {
  gulp.watch(config.source.test.editor, ['_test']);
});

gulp.task('_test', function() {
  return gulp.src(config.source.test.editor, {read:false})
    .pipe(mocha({
      reporter : 'min',
      require: 'test/bootstrap.js',
    }))
    .on('error', utils.log);
});
