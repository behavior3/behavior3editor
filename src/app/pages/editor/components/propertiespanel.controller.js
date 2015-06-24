(function() {
  'use strict';

  angular
    .module('app')
    .controller('PropertiespanelController', PropertiespanelController);

  PropertiespanelController.$inject = [
    '$scope',
    '$window'
  ];

  function PropertiespanelController($scope,
                                     $window) {
    var vm = this;
    vm.original = null;
    vm.block = null;
    vm.update = update;

    _create();
    _activate();

    $scope.$on('$destroy', _destroy);

    function _activate() {
      var p = $window.editor.project.get();
      var t = p.trees.getSelected();
      var s = t.blocks.getSelected();

      if (s.length === 1) {
        vm.original = s[0];
        vm.block = {
          title       : vm.original.title,
          description : vm.original.description,
          properties  : tine.merge({}, vm.original.properties)
        }
      } else {
        vm.original = false;
        vm.block = false;
      }
    }
    function _event(e) {
      setTimeout(function() {$scope.$apply(function() { _activate(); });}, 0);
      
    }
    function _create() {
      $window.editor.on('blockselected', _event);
      $window.editor.on('blockdeselected', _event);
      $window.editor.on('blockremoved', _event);
      $window.editor.on('treeselected', _event);
      $window.editor.on('nodechanged', _event);
    }
    function _destroy() {
      $window.editor.off('blockselected', _event);
      $window.editor.off('blockdeselected', _event);
      $window.editor.off('blockremoved', _event);
      $window.editor.off('treeselected', _event);
      $window.editor.off('nodechanged', _event);
    }

    function update() {
      var p = $window.editor.project.get();
      var t = p.trees.getSelected();
      t.blocks.update(vm.original, vm.block);
    }
  }
})();