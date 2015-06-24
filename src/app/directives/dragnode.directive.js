(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3DragNode', dragNode);

  dragNode.$inject = [
    '$window'
  ]

  function dragNode($window) {
    var directive = {
      restrict    : 'A',
      link        : link,
    };
    return directive;

    function link(scope, element, attrs) {
      element.attr('draggable', 'true');

      element.bind('dragstart', function(e) {
        var img = $window.editor.preview(attrs.name);
        e.dataTransfer.setData('name', attrs.name);
        e.dataTransfer.setDragImage(img, img.width/2, img.height/2);
      })
    }
  }

})();


// .directive('draggableNode', function($window) {
//   return {
//     restrict: 'A',
//     link: function(scope, element, attributes, controller) {
//       angular.element(element).attr("draggable", "true");
//       element.bind("dragstart", function(e) {
//         var img = $window.app.editor.preview(attributes.id.replace('node-', ''));
  
//         e.dataTransfer.setData('text', attributes.id);
//         e.dataTransfer.setDragImage(img, img.width/2, img.height/2);
//       });
//     }
//   }
// })
