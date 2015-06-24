angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'ngAnimate'
])

.run(['$rootScope', '$window', '$state',
  function Execute($rootScope, $window, $state) {
    $rootScope.isDesktop = !!$window.process && !!$window.require;

    $rootScope.go = function(state, params) {
      $state.go(state, params);
    }
  }
])

.run(['$window', '$animate', '$location', '$document', '$timeout', 'settingsService', 'projectService',
  function Execute($window,
                   $animate,
                   $location,
                   $document,
                   $timeout,
                   settingsService, 
                   projectService) {

    // reset path
    $location.path('/')

    // add drop to canvas
    angular
      .element($window.editor._game.canvas)
      .attr('b3-drop-node', true);

    // initialize editor
    settingsService.getSettings();
    projectService
      .getRecentProjects()
      .then(function(projects) {
        
        function closePreload() {
          $timeout(function() {
            var element = angular.element(document.getElementById('prld'));
            $animate.addClass(element, 'preload-fade')
              .then(function() {
                element.remove();
              })
          }, 500);
        }

        if (projects.length > 0 && projects[0].isOpen) {
          projectService
            .openProject(projects[0].path)
            .then(function() {
              closePreload();
            })
        } else {
          closePreload();
        }
      })
  }
])
