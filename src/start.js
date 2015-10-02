var editor;

function startApp() {
  var domProgress = document.getElementById('page-preload');
  
  editor = new b3e.editor.Editor();
  angular.bootstrap(document, ['app']);
}