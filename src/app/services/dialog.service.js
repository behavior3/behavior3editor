angular
  .module('app')
  .factory('dialogService', dialogService);

dialogService.$inject = ['$window', '$q', '$document'];

function dialogService($window, $q, $document) {
  var service = {
    alert         : alert,
    confirm       : confirm,
    prompt        : prompt,
    saveAs        : saveAs,
    openFile      : openFile,
    openDirectory : openDirectory
  };
  return service;

  function _callFileDialog(dialog) {
    return $q(function(resolve) {
      dialog.addEventListener('change', function() {
        resolve(dialog.value);
      })
      dialog.click();
    });
  }

  function alert(title, text, type, options) {
    options = options || {};
    options.title = title;
    options.text = text;
    options.type = type;
    options.customClass = type;

    return $q(function(resolve) { swal(options, function() {resolve()}); });
  }
  function confirm(title, text, type, options) {
    options = options || {};
    options.title = title;
    options.text = text;
    options.type = type;
    options.customClass = type;
    options.showCancelButton = true;

    return $q(function(resolve, reject) {
      $window.swal(options, function(ok) { ok?resolve():reject(); });
    });
  }
  function prompt(title, text, type, placeholder, options) {
    options = options || {};
    options.title = title;
    options.text = text;
    options.type = type || 'input';
    options.inputPlaceholder = placeholder;
    options.customClass = type;
    options.showCancelButton = true;

    return $q(function(resolve, reject) {
      swal(options, function(val) { val!==false?resolve(val):reject(val); });
    });
  }
  function saveAs(placeholder, types) {
    var dialog = $document[0].createElement('input');
    dialog.type = 'file';
    dialog.nwsaveas = placeholder || '';
    if (angular.isArray(types)) {
      dialog.accept = types.join(',');
    } else if (angular.isString(types)) {
      dialog.accept = types;
    }
    
    return _callFileDialog(dialog);
  }
  function openFile(multiple, types) {
    var dialog = $document[0].createElement('input');
    dialog.type = 'file';
    if (multiple) {
      dialog.multiple = 'multiple';
    }

    if (angular.isArray(types)) {
      dialog.accept = types.join(',');
    } else if (angular.isString(types)) {
      dialog.accept = types;
    }

    return _callFileDialog(dialog);
  }
  function openDirectory() {
    var dialog = $document[0].createElement('input');
    dialog.type = 'file';
    dialog.nwdirectory = 'nwdirectory';
    return _callFileDialog(dialog);
  }
  
}