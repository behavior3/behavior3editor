angular
  .module('app')
  .factory('dialogService', dialogService);

dialogService.$inject = ['$window', '$q', '$document', 'nodejsService'];

function dialogService($window, $q, $document, nodejsService) {
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
      });
      dialog.click();
    });
  }

  function alert(title, text, type, options) {
    options = options || {};
    options.title = title;
    options.text = text;
    options.type = type;
    options.customClass = type;

    return $q(function(resolve) { swal(options, function() { resolve(); }); });
  }
  function confirm(title, text, type, options) {
    options = options || {};
    options.title = title;
    options.text = text;
    options.type = type;
    options.customClass = type;
    options.showCancelButton = true;

    return $q(function(resolve, reject) {
      $window.swal(options, function(ok) {
        if (ok) {
          resolve();
        } else {
          reject();
        }
      });
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
      swal(options, function(val) { 
        if (val!==false) {
          resolve(val);
        } else {
          reject(val);
        }
      });
    });
  }
  function saveAs(placeholder, types) {
    return $q(function(resolve, reject) {
      var value = nodejsService.dialog.showSaveDialog({
        title: 'Save project as...',
        defaultPath: placeholder + '.b3',
        filters : [
          {name: 'Behavior3 File', extensions: ['b3', 'json']},
          {name: 'All Files', extensions: ['*']}
        ]
      });
      if (value) {
        resolve(value);
      } else {
        reject();
      }
    });
  }
  function openFile(multiple, types) {
    return $q(function(resolve, reject) {
      var value = nodejsService.dialog.showOpenDialog({
        title: 'Open file...',
        multiSelections: multiple,
        properties: ['openFile'],
        filters : [
          {name: 'Behavior3 File', extensions: ['b3', 'json']},
          {name: 'All Files', extensions: ['*']}
        ]
      });

      if (value) {
        if (!multiple) {
          value = value[0];
        }
        console.log(value);
        resolve(value);
      } else {
        reject();
      }
    });
  }
  function openDirectory() {
    return $q(function(resolve, reject) {
      var value = nodejsService.dialog.showOpenDialog({
        title: 'Open directory...',
        properties: ['openDirectory']
      });
      if (value) {
        resolve(value);
      } else {
        reject();
      }
    });
  }
  
}