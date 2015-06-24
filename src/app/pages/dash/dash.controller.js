(function() {
  'use strict';

  angular
    .module('app')
    .controller('DashController', DashController);

  DashController.$inject = [
    '$scope',
    'projectService'
  ];

  function DashController($scope, projectService) {
    var vm = this;
    vm.project = null;
    _activate();

    function _activate() {
      vm.project = projectService.getProject();
    }
    $scope.$on('dash-projectchanged', function() {
      _activate();
    })
  }
})();