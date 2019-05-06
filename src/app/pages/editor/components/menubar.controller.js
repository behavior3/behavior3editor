(function() {
  'use strict';

  angular
    .module('app')
    .controller('MenubarController', MenubarController);

  MenubarController.$inject = [
    '$scope',
    '$window',
    '$state',
    'dialogService',
    'projectModel',
    'notificationService'
  ];

  function MenubarController($scope, 
                             $window,
                             $state,
                             dialogService,
                             projectModel,
                             notificationService) {
    var vm = this;
    vm.onNewTree           = onNewTree;
    vm.onCloseProject      = onCloseProject;
    vm.onBackToProject     = onBackToProject;
    vm.onSaveProject       = onSaveProject;
    vm.onExportProjectJson = onExportProjectJson;
    vm.onExportTreeJson    = onExportTreeJson;
    vm.onExportNodesJson   = onExportNodesJson;
    vm.onImportProjectJson = onImportProjectJson;
    vm.onImportTreeJson    = onImportTreeJson;
    vm.onImportNodesJson   = onImportNodesJson;
    vm.onUndo              = onUndo;
    vm.onRedo              = onRedo;
    vm.onCopy              = onCopy;
    vm.onCut               = onCut;
    vm.onPaste             = onPaste;
    vm.onDuplicate         = onDuplicate;
    vm.onRemove            = onRemove;
    vm.onRemoveAllConns    = onRemoveAllConns;
    vm.onRemoveInConns     = onRemoveInConns;
    vm.onRemoveOutConns    = onRemoveOutConns;
    vm.onAutoOrganize      = onAutoOrganize;
    vm.onZoomIn            = onZoomIn;
    vm.onZoomOut           = onZoomOut;
    vm.onSelectAll         = onSelectAll;
    vm.onDeselectAll       = onDeselectAll;
    vm.onInvertSelection   = onInvertSelection;

    _create();
    _activate();
    $scope.$on('$destroy', _destroy);

    function _activate() {
    }

    function _shortcut_projectclose(f) {
      if (!$scope.$$phase) { 
        $scope.$apply(function() { onCloseProject(); });
      } else {
        onCloseProject();
      }
      return false;
    }
    function _shortcut_projectsave(f) {
      if (!$scope.$$phase) { 
        $scope.$apply(function() { onSaveProject(); });
      } else {
        onSaveProject();
      }
      return false;
    }
    function _create() {
      Mousetrap.bind('ctrl+q', _shortcut_projectclose);
      Mousetrap.bind('ctrl+s', _shortcut_projectsave);
      Mousetrap.bind('ctrl+z', onUndo);
      Mousetrap.bind('ctrl+shift+z', onRedo);
      Mousetrap.bind('ctrl+c', onCopy);
      Mousetrap.bind('ctrl+v', onPaste);
      Mousetrap.bind('ctrl+x', onCut);
      Mousetrap.bind('ctrl+d', onDuplicate);
      Mousetrap.bind('del', onRemove);
      Mousetrap.bind('a', onAutoOrganize);
      Mousetrap.bind('ctrl+a', onSelectAll);
      Mousetrap.bind('ctrl+shift+a', onDeselectAll);
      Mousetrap.bind('ctrl+i', onInvertSelection);
    }
    function _destroy() {
      Mousetrap.unbind('ctrl+q', _shortcut_projectclose);
      Mousetrap.unbind('ctrl+s', _shortcut_projectsave);
      Mousetrap.unbind('ctrl+z', onUndo);
      Mousetrap.unbind('ctrl+shift+z', onRedo);
      Mousetrap.unbind('ctrl+c', onCopy);
      Mousetrap.unbind('ctrl+v', onPaste);
      Mousetrap.unbind('ctrl+x', onCut);
      Mousetrap.unbind('ctrl+d', onDuplicate);
      Mousetrap.unbind('del', onRemove);
      Mousetrap.unbind('a', onAutoOrganize);
      Mousetrap.unbind('ctrl+a', onSelectAll);
      Mousetrap.unbind('ctrl+shift+a', onDeselectAll);
      Mousetrap.unbind('ctrl+i', onInvertSelection);
    }

    function _getProject() {
      return $window.editor.project.get();
    }
    function _getTree() {
      var project = $window.editor.project.get();
      return project.trees.getSelected();
    }

    function onExportProjectJson() {
      $state.go('editor.export', {type:'project', format:'json'});
      return false;
    }
    function onExportTreeJson() {
      $state.go('editor.export', {type:'tree', format:'json'});
      return false;
    }
    function onExportNodesJson() {
      $state.go('editor.export', {type:'nodes', format:'json'});
      return false;
    }
    function onImportProjectJson() {
      $state.go('editor.import', {type:'project', format:'json'});
      return false;
    }
    function onImportTreeJson() {
      $state.go('editor.import', {type:'tree', format:'json'});
      return false;
    }
    function onImportNodesJson() {
      $state.go('editor.import', {type:'nodes', format:'json'});
      return false;
    }

    function onCloseProject() {
      function doClose() {
        projectModel.closeProject();
        $state.go('dash.projects');
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            'Leave without saving?', 
            'If you proceed you will lose all unsaved modifications.', 
            null)
          .then(doClose);
      } else {
        doClose();
      }

      return false;
    }
    function onBackToProject() {
      onSaveProject();
      $state.go('dash.projects');
    }
    function onSaveProject() {
      projectModel
        .saveProject()
        .then(function() {
          notificationService.success(
            'Project saved',
            'The project has been saved'
          );
        }, function() {
          notificationService.error(
            'Error',
            'Project couldn\'t be saved'
          );
        });
      return false;
    }
    function onNewTree() {
      var project = _getProject();
      project.trees.add();
      return false;
    }
    function onUndo() {
      var project = _getProject();
      project.history.undo();
      return false;
    }
    function onRedo() {
      var project = _getProject();
      project.history.redo();
      return false;
    }
    function onCopy() {
      var tree = _getTree();
      tree.edit.copy(); 
      return false;
    }
    function onCut() {
      var tree = _getTree();
      tree.edit.cut();
      return false;
    }
    function onPaste() {
      var tree = _getTree();
      tree.edit.paste();
      return false;
    }
    function onDuplicate() {
      var tree = _getTree();
      tree.edit.duplicate();
      return false;
    }
    function onRemove() {
      var tree = _getTree();
      tree.edit.remove();
      return false;
    }
    function onRemoveAllConns() {
      var tree = _getTree();
      tree.edit.removeConnections();
      return false;
    }
    function onRemoveInConns() {
      var tree = _getTree();
      tree.edit.removeInConnections();
      return false;
    }
    function onRemoveOutConns() {
      var tree = _getTree();
      tree.edit.removeOutConnections();
      return false;
    }
    function onAutoOrganize() {
      var tree = _getTree();
      tree.organize.organize();
      return false;
    }
    function onZoomIn() {
      var tree = _getTree();
      tree.view.zoomIn();
      return false;
    }
    function onZoomOut() {
      var tree = _getTree();
      tree.view.zoomOut();
      return false;
    }
    function onSelectAll() {
      var tree = _getTree();
      tree.selection.selectAll();
      return false;
    }
    function onDeselectAll() {
      var tree = _getTree();
      tree.selection.deselectAll();
      return false;
    }
    function onInvertSelection() {
      var tree = _getTree();
      tree.selection.invertSelection();
      return false;
    }
  }
})();