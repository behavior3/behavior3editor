(function() {
  'use strict';

  angular
    .module('app')
    .factory('settingsService', settingsService);

  settingsService.$inject = [
    '$q',
    'storageService',
    'systemService',
    'editorService'
  ];

  function settingsService($q,
                           storageService, 
                           systemService,
                           editorService) {

    // HEADER //
    var settingsPath = systemService.join(systemService.getDataPath(), 'settings.json');
    var settingsCache = null;

    var service = {
      getSettings   : getSettings,
      saveSettings  : saveSettings,
      resetSettings : resetSettings,
    };
    return service;

    // BODY //
    function getSettings() {
      return $q(function(resolve, reject) {
        if (!settingsCache) {
          var defaultData = editorService.getDefaultSettings();
          try {
            var data = storageService.load(settingsPath);
            editorService.applySettings(data);
          } catch (e) {}

          // Create if storage file does not exist
          if (!data) {
            data = defaultData;
            storageService.save(settingsPath, data);
          }

          settingsCache = tine.merge({}, defaultData, data);
        }

        resolve(settingsCache);
      })
    }
    function saveSettings(settings) {
      return $q(function(resolve, reject) {
        editorService.applySettings(settings);
        storageService.save(settingsPath, settings);
        settingsCache = settings;
        resolve();
      })
    }
    function resetSettings() {
      return $q(function(resolve, reject) {
        var settings = editorService.getDefaultSettings();
        storageService.save(settingsPath, settings);
        settingsCache = settings;
        editorService.applySettings(settings);
        resolve();
      })
    }
  }
})();