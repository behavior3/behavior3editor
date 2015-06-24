(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3Tabset', tabset);

  function tabset() {
    var directive = {
      restrict         : 'EA',
      transclude       : true,
      replace          : true,
      scope            : {},
      templateUrl      : 'app/directives/tabset.html',
      bindToController : true,
      controllerAs     : 'tabset',
      controller       : tabsetController,
    };
    return directive;

    function tabsetController() {
      // HEAD //
      var vm = this;
      vm.tabs = [];
      vm.add = add;
      vm.select = select;

      // BODY //
      function add(tab) {
        vm.tabs.push(tab);
      }

      function select(tab) {
        angular.forEach(vm.tabs, function(t) {
          if (t.active && t !== tab) {
            t.active = false;
          }
        })

        tab.active = true;
      }

    }
  }

})();