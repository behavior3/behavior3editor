(function() {
  'use strict';

  angular
    .module('app')
    .directive('blacklist', blacklist);

  function blacklist() {
    var directive = {
      require     : 'ngModel',
      restrict    : 'A',
      link        : link,
    };
    return directive;

    function link(scope, element, attrs, ctrl) {
      var blacklist = attrs.blacklist.split(',');
      
      //For DOM -> model validation
      ctrl.$parsers.unshift(function(value) {
         var valid = blacklist.indexOf(value) === -1;
         ctrl.$setValidity('blacklist', valid);
         return valid ? value : undefined;
      });

      //For model -> DOM validation
      ctrl.$formatters.unshift(function(value) {
         ctrl.$setValidity('blacklist', blacklist.indexOf(value) === -1);
         return value;
      });
    }
  }

})();