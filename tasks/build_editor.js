/**
 * Tasks for build our editor files. This file does not include the editor
 * tests
 */
 var gulp      = require('gulp')
 var config    = require('./config.js')

 var concat     = require('gulp-concat')
 var sourcemaps = require('gulp-sourcemaps');
 var minifyHTML = require('gulp-minify-html');
 var uglify     = require('gulp-uglify');
 var rename     = require('gulp-rename');
 var replace    = require('gulp-replace');
 var connect    = require('gulp-connect');
 var babelify   = require('babelify');
 var browserify = require('browserify');
 var source     = require('vinyl-source-stream');
 var buffer     = require('vinyl-buffer');


 // Internal variables
 var BUILD_PATH = config.build.paths[config.environment]


// Interface
gulp.task('_build_editor', [
  '_build_editor_js',
  '_build_editor_html',
])

// Tasks
gulp.task('_build_editor_js', function() {
  return browserify({
      entries : config.source.editor.jsEntry,
      debug   : true,
      paths   : ['./source/']
    })
    .transform(babelify.configure({
      presets: ['es2015'],
    }))
    .bundle()
    .pipe(source('editor.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
      .pipe(uglify().on('error', function(error) {
        console.error('Error: '+error.message);
        console.error('Line: '+error.lineNumber);
      }))
      // .pipe(concat('editor.js'))
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {
      sourceRoot: 'source/editor',
      sourceMappingURLPrefix:'/js'
    }))
    .pipe(replace(/%ENVIRONMENT%/g, config.environment))
    .pipe(replace(/%VERSION%/g, config.version))
    .pipe(replace(/%DATE%/g, config.date))
    .pipe(replace(/%REVISION%/g, config.revision))
    .pipe(gulp.dest(BUILD_PATH+'js'))
    .pipe(connect.reload())
});


gulp.task('_build_editor_html', function() {
  return gulp.src(config.source.editor.html)
  .pipe(replace(/%ENVIRONMENT%/g, config.environment))
  .pipe(replace(/%VERSION%/g, config.version))
  .pipe(replace(/%DATE%/g, config.date))
  .pipe(replace(/%REVISION%/g, config.revision))
  .pipe(minifyHTML({empty:true}))
  .pipe(concat('editor.html'))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(BUILD_PATH+'html'))
  .pipe(connect.reload())
});
