/**
 * Tasks responsible for running the web server and the livereload server.
 */
var gulp    = require('gulp');
var connect = require('gulp-connect');
var config  = require('./config.js');

var BUILD_PATH = config.build.paths[config.environment]

gulp.task('_serve', [
  '_build',
  '_watch'
]);

gulp.task('_livereload', function() {
  connect.server({
    livereload : true,
    root       : BUILD_PATH,
    port       : 7000,
  });
});

gulp.task('_watch', ['_livereload'], function() {
  gulp.watch(config.source.editor.js, ['_build_editor_js']);
  gulp.watch(config.source.editor.html, ['_build_editor_html']);
  gulp.watch(config.source.app.js, ['_build_app_js']);
  gulp.watch(config.source.app.lessAll, ['_build_app_less']);
  gulp.watch(config.source.app.templates, ['_build_app_templates']);
  gulp.watch(config.source.app.entry, ['_build_app_entry']);
  gulp.watch(config.source.app.imgs, ['_build_app_imgs']);
});
