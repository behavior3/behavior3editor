(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3KeyTable', keytable)
    .controller('KeyTableController', KeyTableController);

  keytable.$inject = ['$parse'];
  function keytable($parse) {
    var directive = {
      require          : '^ngModel',
      restrict         : 'EA',
      replace          : true,
      bindToController : true,
      controller       : 'KeyTableController',
      controllerAs     : 'keytable',
      templateUrl      : 'directives/keytable.html',
      link: link
    };
    return directive;

    function link(scope, element, attrs) {
      // get the value of the `ng-model` attribute
      scope.keytable.heading = attrs.heading;
      scope.keytable._onChange = $parse(attrs.ngChange);

      var variable = attrs.ngModel;
      scope.$watch(variable, function(model) {
        scope.keytable.reset(model);
      });
    }
  }

  KeyTableController.$inject = ['$scope'];
  function KeyTableController($scope) {
    // HEAD //
    var vm = this;
    vm._onChange = null;
    vm.model  = $scope.keytable.model || $scope.model || null;
    vm.rows   = [];
    vm.add    = add;
    vm.remove = remove;
    vm.change = change;
    vm.reset  = reset;

    _activate();
    
    // BODY //
    function _activate() {
      if (vm.model) {
        for (var key in vm.model) {
          add(key, vm.model[key], false);
        }
      } else {
        vm.model = {};
      }
    }

    function reset(model) {
      vm.rows = [];
      vm.model = model;
      _activate();
    }

    function add(key, value, fixed) {
      vm.rows.push({key:key, value:value, valueType:getValueType(value), fixed:fixed===true, extra_css:""});
    }

    function remove(i) {
      vm.rows.splice(i, 1);
      change();
    }

    function change(key) {
      for (var key in vm.model){
        if (vm.model.hasOwnProperty(key)){
          delete vm.model[key];
        }
      }

      for (var i=0; i<vm.rows.length; i++) {
        var r = vm.rows[i];
        if (! r.key) continue;

        var value = r.value;
        var oldValue = r.value;
        if (!isNaN(value) && value !== '') {
          value = parseFloat(value);
        }
        var newValue = value;

        vm.model[r.key] = value;
        
        // This used to be here, but I moved it down because it seems it
        // results in better performance when many keys and values are involved.
        //if (vm._onChange) {
          //vm._onChange($scope);
        //}
        
        r.valueType = getValueType(value);

        if (oldValue != String(newValue)) {
          r.extra_css = "background-color: red;";
        } else {
          r.extra_css = "";
        }
      }

      // This also is to make sure if there are no more keys, the empty model
      // is correctly propagated to the place where the models are stored
      if (vm._onChange) {
        vm._onChange($scope);
      }
    }
  }

  function getValueType(value) {
    if (value == "true") {
      return "BOL";
    } else if (value == "false") {
      return "BOL";

    } else if (((typeof value) === "string")
              && value.length > 0
              && value.slice(-1) == "d"
              && numberBeforeD(value)
              ) {
      return "DBL";
    } else if (!isNaN(value) && value !== '') {
      var valuePrime = parseFloat(value);
      var strValue = String(valuePrime);

      if (/\./.test(strValue)) {
        return "DBL";
      } else {
        return "INT";
      }
    } else {
      return "STR";
    }
  }

  function numberBeforeD(value) {
    var shortValue = value.substring(0, value.length - 1);

    return !isNaN(shortValue);
  }

})();
