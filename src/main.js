
var editor;

function preload() {
  if (MANIFEST.length > 0) {
    var domProgress = document.getElementById('prgs');
    var loader = new createjs.LoadQueue(true);
    loader.on('progress', function(event) {
      domProgress.innerHTML = Math.floor(event.progress*100)+'%';
    });

    // on complete
    loader.on('complete', function(event) {
      start();
    });

  // load
    loader.loadManifest(MANIFEST);
  } else {
    start();
  }
}


function start() {
  var domProgress = document.getElementById('prgs');
  domProgress.innerHTML = 'starting';
  editor = new b3e.editor.Editor();
  angular.bootstrap(document, ['app']);
}

preload();