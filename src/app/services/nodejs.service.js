angular
  .module('app')
  .factory('nodejsService', nodejsService);

nodejsService.$inject = ['$window'];

function nodejsService($window) {
  var ok = !!$window.require;
  var remote = (ok?$window.require('remote'):null);
  var service = {
    ok   : ok,
    fs   : (ok?$window.require('fs'):null),
    path : (ok?$window.require('path'):null),
    dialog : (ok?remote.require('dialog'):null),
  };
  return service;

}