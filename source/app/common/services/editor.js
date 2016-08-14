angular.module('behavior3.common.services.editor', [])
       .factory('b3Editor', EditorService);

// ## Analitics
EditorService.$inject = ['$window'];
function EditorService($window) {
  return new $window.b3.Editor();
}
