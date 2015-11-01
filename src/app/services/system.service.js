angular
  .module('app')
  .factory('systemService', systemService);

systemService.$inject = ['$window', 'nodejsService'];

function systemService($window, nodejsService) {
  var isDesktop = !!$window.process;
  var service = {
    isDesktop   : isDesktop,
    getDataPath : getDataPath,
    join        : join,
  };
  return service;

  function _createIfNonExist(path) {
    try {
      var s = nodejsService.fs.statSync(path);
    } catch (e) {
      nodejsService.fs.mkdirSync(path);
    }
  }
  function getDataPath() {
    if (isDesktop) {
      var datapath = process.env.APPDATA;
      if (!datapath) {
        datapath = process.env.HOME + '/.behavior3';
      }

      var path = join(datapath, 'b3editor');
      _createIfNonExist(datapath);
      _createIfNonExist(path);
      return path;
    } else {
      return 'b3editor';
    }
  }
  function join() {
    if (isDesktop) {
      return nodejsService.path.join.apply(nodejsService.path, arguments);
    } else {
      var s = arguments[0];
      for (var i=1; i<arguments.length; i++) {
        s += '-'+arguments[i];
      }
      return s;
    }
  }
}