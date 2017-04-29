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
        // This is an in-place update s.t. when editing properties of the root node
        // you can actually TYPE without having to reselect the properties panel.
        var rowIndex = 0;

        for (var key in vm.model) {
          if (rowIndex < vm.rows.length) {
            set(rowIndex, key, vm.model[key], false);
          } else {
            add(key, vm.model[key], false);
          }

          rowIndex += 1;
        }

        if (rowIndex < vm.rows.length) {
          vm.rows.splice(rowIndex, vm.rows.length - rowIndex);
        } 
      } else {
        vm.model = {};
      }
    }

    function reset(model) {
      // This is broken atm but turned on the root node does not work.
      // vm.rows = [];
      vm.model = model;
      _activate();
    }

    function add(key, value, fixed) {
      vm.rows.push({key:key, value:value, valueType:getValueType(value), fixed:fixed===true, extra_css:""});
    }

    function set(i, key, value, fixed) {
      vm.rows[i].key = key;
      vm.rows[i].value = value;
      vm.rows[i].valueType = getValueType(value);
      vm.rows[i].fixed = fixed;
      vm.rows[i].extra_css = "";
    }

    function remove(i) {
      vm.rows.splice(i, 1);
      change();
    }

    function change(key) {
      for (var modelKey in vm.model){
        if (vm.model.hasOwnProperty(modelKey)){
          delete vm.model[modelKey];
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

        if (oldValue !== undefined && newValue !== undefined && String(oldValue).trim() != String(newValue).trim()) {
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

    } else if (((typeof value) === "string") && (value.length > 0) && (value.slice(-1) == "d") && (numberBeforeD(value))) {
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

  function compareMaps(map1, map2) {
      if (map1.size !== map2.size) {
          return false;
      }
      for (var key in map1) {
          var val = map1[key];
          var testVal = map2[key];
          // in cases of an undefined value, make sure the key
          // actually exists on the object so there are no false positives
          if (testVal !== val || (testVal === undefined && !map2.has(key))) {
              return false;
          }
      }
      return true;
  }

})();
