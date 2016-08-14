angular.module('behavior3')

.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider
      .state('home', {
        url: '/',
        template: '<behavior3-home></behavior3-home>'
      })
      .state('style', {
        url: '/style',
        template: '<behavior3-style></behavior3-style>'
      })
      ;

    // $urlRouterProvider
    //   .otherwise(function($injector) {
    //     var $state = $injector.get('$state');
    //     $state.go('404', null, {location: false});
    //   });
  }
]);
