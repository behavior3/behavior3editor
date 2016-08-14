/**
 * These tasks are responsible for copying, compacting and uglifying (if
 * necessary) the vendor libraries and files
 */

var gulp      = require('gulp')
var config    = require('./config.js')

var concat    = require('gulp-concat')
var minifyCSS = require('gulp-clean-css')


// Internal variables
var BUILD_PATH = config.build.paths[config.environment]


// Interface
gulp.task('_build_vendor', [
  '_build_vendor_js',
  '_build_vendor_html',
  '_build_vendor_css',
  '_build_vendor_fonts',
])


// Tasks
gulp.task('_build_vendor_js', function() {
  return gulp.src(config.source.vendor.js)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(BUILD_PATH+'js'));
})


gulp.task('_build_vendor_html', function() {
  return gulp.src(config.source.vendor.html)
    .pipe(gulp.dest(BUILD_PATH+'html'));
});


gulp.task('_build_vendor_css', function() {
  return gulp.src(config.source.vendor.css)
    .pipe(minifyCSS())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(BUILD_PATH+'css'));
});


gulp.task('_build_vendor_fonts', function() {
  return gulp.src(config.source.vendor.fonts)
    .pipe(gulp.dest(BUILD_PATH+'fonts'));
});
