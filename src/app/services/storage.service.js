angular
  .module('app')
  .factory('storageService', storageService);

storageService.$inject = ['$q', 'localStorageService', 'fileStorageService'];

function storageService($q, localStorageService, fileStorageService) {
  var storage = (fileStorageService.ok?fileStorageService:localStorageService);
  
  var service = {
    save        : save,
    saveAsync   : saveAsync,
    load        : load,
    loadAsync   : loadAsync,
    remove      : remove,
    removeAsync : removeAsync,
  };
  return service;

  function save(path, data) {
    storage.save(path, data);
  }
  function saveAsync(path, data) {
    return $q(function(resolve, reject) {
      try {
        storage.save(path, data);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  function load(path) {
    return storage.load(path);
  }
  function loadAsync(path) {
    return $q(function(resolve, reject) {
      try {
        var data = storage.load(path);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }
  function remove(path) {
    storage.remove(path);
  }
  function removeAsync(path) {
    return $q(function(resolve, reject) {
      try {
        storage.remove(path);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}