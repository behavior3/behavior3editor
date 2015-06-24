(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3Tab', tab);

  function tab() {
    var directive = {
      require     : '^b3Tabset',
      restrict    : 'EA',
      scope       : {
        active : '=?',
        heading  : '@'
      },
      transclude  : true,
      templateUrl : 'app/directives/tab.html',
      link        : link,
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      scope.active = !!scope.active;
      ctrl.add(scope);
    }
  }

})();