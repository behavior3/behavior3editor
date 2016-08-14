/**
 * Tasks for build the app files.
 */
 var gulp      = require('gulp')
 var config    = require('./config.js')

 var concat        = require('gulp-concat')
 var less          = require('gulp-less');
 var minifyCSS     = require('gulp-clean-css')
 var minifyHTML    = require('gulp-minify-html');
 var sourcemaps    = require('gulp-sourcemaps');
 var uglify        = require('gulp-uglify');
 var rename        = require('gulp-rename');
 var templateCache = require('gulp-angular-templatecache');
 var autoprefixer  = require('gulp-autoprefixer');
 var replace       = require('gulp-replace');
 var connect       = require('gulp-connect');
 var babel         = require('gulp-babel');
 var browserify    = require('browserify');
 var source        = require('vinyl-source-stream');


 // Internal variables
 var BUILD_PATH = config.build.paths[config.environment]


// Interface
gulp.task('_build_app', [
  '_build_app_js',
  '_build_app_less',
  '_build_app_templates',
  '_build_app_entry',
  '_build_app_imgs',
])


// Tasks
gulp.task('_build_app_js', function() {
  return gulp.src(config.source.app.js)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.init())
      .pipe(uglify().on('error', function(error) {
        console.error('Error: '+error.message);
        console.error('Line: '+error.lineNumber);
      }))
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {
      sourceRoot: 'source/app',
      sourceMappingURLPrefix:'/js'
    }))
    .pipe(replace(/%ENVIRONMENT%/g, config.environment))
    .pipe(replace(/%VERSION%/g, config.version))
    .pipe(replace(/%DATE%/g, config.date))
    .pipe(replace(/%REVISION%/g, config.revision))
    .pipe(gulp.dest(BUILD_PATH+'js'))
    .pipe(connect.reload())
})


gulp.task('_build_app_less', function() {
  return gulp
    .src(config.source.app.lessEntry)
    .pipe(less())
    .on('error', function(e) {
      console.error(e);
      this.emit('end');
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .on('error', function(e) {
      console.error(e);
      this.emit('end');
    })
    .pipe(minifyCSS())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest(BUILD_PATH+'css'))
    .pipe(connect.reload())
});


gulp.task('_build_app_templates', function() {
  return gulp
    .src(config.source.app.templates)
    .pipe(replace(/%ENVIRONMENT%/g, config.environment))
    .pipe(replace(/%VERSION%/g, config.version))
    .pipe(replace(/%DATE%/g, config.date))
    .pipe(replace(/%REVISION%/g, config.revision))
    .pipe(minifyHTML({empty:true}))
    .pipe(templateCache('templates.min.js', {
      root: 'app/',
      standalone: true,
      htmlmin: true,
    }))
    .pipe(uglify())
    .pipe(gulp.dest(BUILD_PATH+'js'))
    .pipe(connect.reload())
})


gulp.task('_build_app_entry', function() {
  return gulp
    .src(config.source.app.entry)
    .pipe(replace(/%ENVIRONMENT%/g, config.environment))
    .pipe(replace(/%VERSION%/g, config.version))
    .pipe(replace(/%DATE%/g, config.date))
    .pipe(replace(/%REVISION%/g, config.revision))
    .pipe(minifyHTML({empty:true}))
    .pipe(gulp.dest(BUILD_PATH))
    .pipe(connect.reload())
})


gulp.task('_build_app_imgs', function() {
  return gulp
    .src(config.source.app.imgs)
    .pipe(gulp.dest(BUILD_PATH+'imgs'))
})
