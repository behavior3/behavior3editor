(function() {
  'use strict';

  angular
    .module('app')
    .directive('b3DragNode', dragNode);

  dragNode.$inject = [
    '$window'
  ];

  function dragNode($window) {
    var directive = {
      restrict    : 'A',
      link        : link,
    };
    return directive;

    function link(scope, element, attrs) {
      element.attr('draggable', 'true');

      element.bind('dragstart', function(e) {
        var canvas = $window.editor.preview(attrs.name);
        var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome')>-1;

        if (isChrome) {
          var img = document.createElement('img');
          img.src = canvas.toDataURL();

          // 10ms delay in order to proper create the image object
          // ugly hack =(
          var time = (new Date()).getTime();
          var delay = time + 10;
          while (time < delay) {
            time = (new Date()).getTime();
          }
          canvas = img;
        }

        e.dataTransfer.setData('name', attrs.name);
        e.dataTransfer.setDragImage(canvas, canvas.width/2, canvas.height/2);
      });
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
