var babel = require('babel-register');

var gulp = require('gulp');
var requiredir = require('requiredir');
var config = require('./tasks/config.js');
requiredir('tasks');

gulp.task('build', ['_build']);
gulp.task('serve', ['_serve']);
gulp.task('test', ['_test']);
gulp.task('serve-test', ['_test', '_test_watch']);
