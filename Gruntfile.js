module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // grunt server
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'src',
          livereload: true
        }
      }
    },

    // grunt watch
    watch: {
      options: {
        livereload: true
      },
      taskName: {    // You need a task, can be any string
        files: [   // Files to livereload on
          "src/assets/less/*.less",
          "src/assets/css/*.css",
          "src/*.js",
          "src/**/*.js",
          "src/*.html",
          "src/**/*.html",
        ]
      }
    },

    // grunt style
    less: {
      options: {
        compress: true,
      },
      target: {
        files: {
          'dist/web/css/app.css': ['src/assets/less/*.less']
        },
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
      },
      target: {
        files: {
          'dist/web/css/load.css': [
            'src/assets/css/fonts.css',
            'src/assets/css/preload.css',
          ],
          'dist/web/css/app.css': [
            'src/vendor/normalize.css/normalize.css',
            'src/vendor/bootstrap/dist/css/bootstrap.min.css',
            'src/vendor/fontawesome/css/font-awesome.min.css',
            'src/vendor/sweetalert/dist/sweetalert.css',
            'dist/web/css/app.css',
          ]
        }
      }
    },

    uglify: {
      target: {
        files: {
          'dist/web/js/load.js': [
            'src/assets/libs/createjs.min.js',
            'src/assets/libs/creatine-1.0.0.min.js',
          ],
          'dist/web/js/libs.js': [
            'src/assets/libs/behavior3js-0.1.0.min.js',
            'src/assets/libs/mousetrap.min.js',
            'src/vendor/angular/angular.min.js',
            'src/vendor/angular-animate/angular-animate.min.js',
            'src/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'src/vendor/angular-ui-router/release/angular-ui-router.min.js',
            'src/vendor/sweetalert/dist/sweetalert.min.js',
          ],
          'dist/web/js/editor.js': [
            'src/editor/namespaces.js',
            'src/editor/utils/*.js',
            'src/editor/**/*.js',
          ],
          'dist/web/js/app.js': [
            'src/app/app.js',
            'src/app/app.routes.js',
            'src/app/app.controller.js',
            'src/app/**/*.js'
          ],
        }
      }
    }, 

    clean: {
      before: ['dist'],
      after: ['temp']
    },

    // grunt fonts
    copy: {
      target: {
        files: [
          {expand:true, cwd:'src/assets/fonts/', src:['**'], dest:'dist/web/fonts/'},
          {expand:true, cwd:'src/assets/imgs/', src:['**'], dest:'dist/web/imgs/'},
          {expand:true, cwd:'src/app', src:['**/*.html'], dest:'dist/web/app/'},
          {src:['src/dist.html'], dest:'dist/web/index.html'},
          {src:['src/main.js'], dest:'dist/web/main.js'},
          {src:['distPackage.json'], dest:'dist/web/package.json'},
        ]
      },
      after: {
        files: [
          {expand:true, cwd:'temp/behavior3editor/', src:['**'], dest:'dist/'},
        ]
      }
    },

    nodewebkit: {
      options: {
        platforms: ['win32', 'osx32', 'linux32'],
        buildDir: 'temp/',
        version: '0.12.1'
      },
      src: ['./dist/web/**/*']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  grunt.registerTask('serve', "Serving...", ['connect:server', 'watch' ]);
  grunt.registerTask('build', [
    'clean:before',
    'less',
    'cssmin',
    'uglify',
    'copy',
    'nodewebkit',
    'copy:after',
    'clean:after']
  );
  grunt.registerTask('build-nw', [
    'nodewebkit',
    'copy:after',
    'clean:after']
  );
};