(function() {
  'use strict';

  angular
    .module('app')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = [
    'notificationService',
    'settingsService',
    'dialogService',
  ];

  function SettingsController(notificationService,
                              settingsService,
                              dialogService) {

    // HEADER //
    var vm = this;
    vm.settings = {};
    vm.saveSettings = saveSettings;
    vm.resetSettings = resetSettings;

    _activate()

    // BODY //
    function _activate() {
      settingsService
        .getSettings()
        .then(function(settings) {
          vm.settings = settings;
        })
    }

    function saveSettings() {
      settingsService
        .saveSettings(vm.settings)
        .then(function() {
          notificationService.success(
            'Settings saved',
            'The editor settings has been updated.'
          );
        })
    }

    function resetSettings() {
      dialogService.confirm(
        'Reset Settings?',
        'Are you sure you want to reset to the default settings?'
      ).then(function() {
        settingsService
          .resetSettings()
          .then(function() {
            notificationService.success(
              'Settings reseted',
              'The editor settings has been updated to default values.'
            );
            _activate();
          })
      });
    }
  }
})();