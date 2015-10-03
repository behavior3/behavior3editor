angular
  .module('app')
  .factory('fileStorageService', fileStorageService);

fileStorageService.$inject = ['nodejsService'];

function fileStorageService(nodejsService) {
  var ok = nodejsService.ok;
  var fs = nodejsService.fs;

  var service = {
    ok     : ok,
    save   : save,
    load   : load,
    remove : remove
  };
  return service;

  function save(path, data) {
    if (typeof data !== 'string') {
      try { data = JSON3.stringify(data); } catch (e) {}
    }

    var file = fs.openSync(path+'~', 'w');
    fs.writeSync(file, data);
    fs.closeSync(file);

    // Rename must be async to override correctly.
    fs.rename(path+'~', path);
  }
  function load(path) {
    var data = fs.readFileSync(path, 'utf-8');
    try { data = JSON3.parse(data); } catch (e) {}
    return data;
  }
  function remove(path) {
    
  }
}