/**
 * Tasks responsible for building the editor source files and tests in order
 * to run mocha
 */
var gulp      = require('gulp')
var config    = require('./config.js')

 var connect    = require('gulp-connect')
 var browserify = require('browserify')
 var babelify   = require('babelify')
 var source     = require('vinyl-source-stream')
 var buffer     = require('vinyl-buffer')
 var glob       = require('glob')

// Internal variables
var BUILD_PATH = config.build.paths.test


// Interface
gulp.task('_build_test', [
  '_build_test_editor',
])


// Tasks
gulp.task('_build_test_editor', function() {
  var files = glob.sync(config.source.editor.test)

  return browserify({
      entries : files,
      debug   : true,
      paths   : ['./source/']
    })
    .transform(babelify.configure({
      presets: ['es2015'],
    }))
    .bundle()
    .pipe(source('unit.js'))
    .pipe(buffer())
    .pipe(gulp.dest(BUILD_PATH))
    .pipe(connect.reload())
})
