// CONFIGURATION FOR GULP TASKS
var argv   = require('yargs').argv;
var rev    = require('git-rev-sync');
var moment = require('moment');
var config = require('../package.json');


// INITIALIZATION
if (argv.environment && argv.environment !== 'local' &&
                        argv.environment !== 'development' &&
                        argv.environment !== 'production' &&
                        argv.environment !== 'test') {
  throw 'Invalid environment "'+argv.environment+'"'
}

var environment = argv.environment || 'local'
var version = config.version
var revision = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' //rev.long()
var date = moment().format('YYYY-MM-DD')


// CONFIGURATION OBJECT
module.exports = {

  // It may assume the values: `local` (default), `development`, or
  // `production`. Use --environment=<ENV> to change it
  environment : environment,

  // The build version, it uses the value from `package.json`
  version : version,

  // The build date, it uses the date and time of when this file is executed
  data : date,

  // The build revision, it uses the git revision
  revision : revision,

  // General build related variables
  build : {
    paths: {
      local       : 'build/dist/local/',
      development : 'build/dist/development/',
      production  : 'build/dist/production/',
      test        : 'build/test/',
    },
  },

  // Paths of source files
  source : {

    // 3th-party files
    vendor: {
      js: [
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/immutable/dist/immutable.min.js',
      ],
      html: [
        'bower_components/polymer/polymer-micro.html',
        'bower_components/polymer/polymer-mini.html',
        'bower_components/polymer/polymer.html'
      ],
      css: [
        'bower_components/normalize-css/normalize.css',
        'bower_components/font-awesome/css/font-awesome.min.css',
      ],
      fonts: [
        'bower_components/font-awesome/fonts/*',
      ],
    },

    // editor files
    editor: {
      jsEntry: 'source/editor/index.js',
      jsAll: [
        'source/editor/**/*.js',
        '!source/editor/**/*.test.js',
      ],
      html: [
        'source/editor/**/*.html',
      ],
      test: 'source/editor/**/*.test.js',
    },

    // app files
    app: {
      js: [
        'source/app/app.js',
        'source/app/app.config.js',
        'source/app/app.setup.js',
        'source/app/app.routes.js',
        'source/app/**/*.js',
        '!source/app/**/*.test.js',
      ],
      lessEntry : 'source/assets/less/index.less',
      lessAll   : 'source/assets/less/**/*.less',
      imgs      : 'source/assets/imgs/**/*',
      templates : 'source/app/**/*.html',
      entry     : 'source/index.html',
    },

    // test files (notice that these variables are for the test runner, not
    // the building process)
    test: {
      editor: 'build/test/unit.js',
    },
  }
}
