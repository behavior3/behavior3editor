(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3DropNode', dropNode);

  dropNode.$inject = [
    '$window'
  ]

  function dropNode($window) {
    var directive = {
      restrict    : 'A',
      link        : link,
    };
    return directive;

    function link(scope, element, attrs) {
      element.bind('dragover', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      });
      element.bind('drop', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        
        var name = e.dataTransfer.getData('name');
        
        var project = $window.editor.project.get();
        var tree = project.trees.getSelected();
        var point = tree.view.getLocalPoint(e.clientX, e.clientY);
        tree.blocks.add(name, point.x, point.y);

        $window.editor._game.canvas.focus();
      });
    }
  }

})();
