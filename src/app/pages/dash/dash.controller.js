(function() {
  'use strict';

  angular
    .module('app')
    .controller('DashController', DashController);

  DashController.$inject = [
    '$scope',
    'projectModel'
  ];

  function DashController($scope, projectModel) {
    var vm = this;
    vm.project = null;
    _activate();

    function _activate() {
      vm.project = projectModel.getProject();
    }
    $scope.$on('dash-projectchanged', function() {
      _activate();
    });
  }
})();