var gulp   = require('gulp');

gulp.task('_build', [
  '_build_vendor',
  '_build_editor',
  '_build_app',
  '_build_test',
]);
