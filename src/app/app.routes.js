angular.module('app')

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/dash/home');

    $stateProvider
      // Dash
      .state('dash', {
        url: '/dash',
        abstract: true,
        templateUrl: 'app/pages/dash/dash.html',
        controller: 'DashController',
        controllerAs: 'dash',
      })
      .state('dash.home', {
        url: '/home',
        templateUrl: 'app/pages/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home',
      })
      .state('dash.projects', {
        url: "/projects",
        templateUrl: 'app/pages/projects/projects.html',
        controller: 'ProjectsController',
        controllerAs: 'projects',
      })
      .state('dash.settings', {
        url: "/settings",
        templateUrl: 'app/pages/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'settings',
      })

      // Editor
      .state('editor', {
        url: "/editor",
        templateUrl: 'app/pages/editor/editor.html',
        controller: 'EditorController',
        controllerAs: 'editor',
      })
      .state('editor.editnode', {
        url: "/node/:name",
        templateUrl: 'app/pages/editor/modals/editnode.html',
        controller: 'EditNodeController',
        controllerAs: 'editnode',
      })
      .state('editor.export', {
        url: "/export/:type/:format",
        templateUrl: 'app/pages/editor/modals/export.html',
        controller: 'ExportController',
        controllerAs: 'export',
      })
      .state('editor.import', {
        url: "/import/:type/:format",
        templateUrl: 'app/pages/editor/modals/import.html',
        controller: 'ImportController',
        controllerAs: 'import',
      })
    }
]);