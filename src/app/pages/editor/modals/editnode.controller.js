(function() {
  'use strict';

  angular
    .module('app')
    .controller('EditNodeController', EditNodeController);

  EditNodeController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$stateParams',
    'dialogService',
    'notificationService'
  ];

  function EditNodeController($scope,
                              $window,
                              $state,
                              $stateParams,
                              dialogService,
                              notificationService) {
    var vm = this;
    vm.action = 'New';
    vm.node = null;
    vm.blacklist = null;
    vm.original = null;
    vm.save = save;
    vm.remove = remove;

    _active();

    function _active() {
      var p = $window.editor.project.get();

      if ($stateParams.name) {
        var node = p.nodes.get($stateParams.name);
        vm.node = node.copy();
        vm.original = node;
        vm.action = 'Update';
      } else {
        vm.node = new b3e.Node();
        vm.node.category = 'composite';
      }

      var blacklist = [];
      p.nodes.each(function(node) {
        if (node.name !== vm.node.name) {
          blacklist.push(node.name);
        }
      })
      vm.blacklist = blacklist.join(',');
    }

    function save() {
      var p = $window.editor.project.get();

      if (vm.original) {
        p.nodes.update(vm.original, vm.node);  
      } else {
        p.nodes.add(vm.node);
      }

      $state.go('editor');
      notificationService
        .success('Node created', 'Node has been created successfully.')
    }

    function remove() {
      dialogService.
        confirm(
          'Remove node?', 
          'Are you sure you want to remove this node?\n\nNote: all blocks using this node will be removed.'
        ).then(function() {
          var p = $window.editor.project.get();
          p.nodes.remove(vm.original);
          notificationService.success(
            'Node removed',
            'The node has been removed from this project.'
          );
          $state.go('editor');
        })
    }
  }

})()