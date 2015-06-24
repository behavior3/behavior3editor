(function() {
  'use strict';

  angular
    .module('app')
    .controller('TreespanelController', TreespanelController);

  TreespanelController.$inject = [
    '$scope',
    '$window',
    'dialogService',
    'notificationService'
  ];

  function TreespanelController($scope, 
                                $window,
                                dialogService,
                                notificationService) {

    // HEAD //
    var vm = this;
    vm.trees   = null;
    vm.newTree = newTree;
    vm.select  = select;
    vm.remove  = remove;
    
    _create();
    _activate();
    $scope.$on('$destroy', _destroy);

    // BODY //
    function _activate() {
      vm.trees = [];

      var p = $window.editor.project.get();
      var selected = p.trees.getSelected();
      p.trees.each(function(tree) {
        var root = tree.blocks.getRoot();
        vm.trees.push({
          'id'       : tree._id,
          'name'     : root.title || 'A behavior tree',
          'active'   : tree===selected,
        });
      });
    }

    function _event(e) {
      if (e.type !== 'blockchanged' || e._target.category === 'root') {
        if (!$scope.$$phase) { 
          $scope.$apply(function() { _activate(); })
        } else {
          _activate();
        }
      }
    }

    function _create() {
      $window.editor.on('blockchanged', _event);
      $window.editor.on('treeselected', _event);
      $window.editor.on('treeremoved', _event);
      $window.editor.on('treeimported', _event);
    }

    function _destroy() {
      $window.editor.off('blockchanged', _event);
      $window.editor.off('treeselected', _event);
      $window.editor.off('treeremoved', _event);
      $window.editor.off('treeimported', _event);
    }

    function newTree() {
      var p = $window.editor.project.get();
      p.trees.add();
    }

    function select(id) {
      var p = $window.editor.project.get();
      p.trees.select(id);
    }

    function remove(id) {
      dialogService.
        confirm(
          'Remove tree?', 
          'Are you sure you want to remove this tree?\n\nNote: all blocks using this tree will be removed.'
        ).then(function() {
          var p = $window.editor.project.get();
          p.trees.remove(id);
          notificationService.success(
            'Tree removed',
            'The tree has been removed from this project.'
          );
        })

    }
  }
})();