(function() {
  'use strict';

  angular
    .module('app')
    .controller('PropertiespanelController', PropertiespanelController);

  PropertiespanelController.$inject = [
    '$scope',
    '$window'
  ];

  function PropertiespanelController($scope,
                                     $window) {
    var vm = this;
    vm.original = null;
    vm.block = null;
    vm.update = update;
    vm.keydown = keydown;

    _create();
    _activate();

    $scope.$on('$destroy', _destroy);

    function _activate() {
      console.log("Activating properties panel");

      var p = $window.editor.project.get();
      var t = p.trees.getSelected();
      var s = t.blocks.getSelected();
      var printDocs = false;

      if (s.length === 1) {
        vm.original = s[0];
        
        vm.block = {
          name        : vm.original.name,
          title       : vm.original.title,
          description : vm.original.description,
          properties  : tine.merge({}, vm.original.properties),
          docs        : "Loading docs for \"" + vm.original.name + "..."
        };

        printDocs = true;
      } else {
        vm.original = false;
        vm.block = false;
      }

      if (window && window.process && window.process.type && printDocs) {
        var process = require('child_process'); 

        var docTarget = vm.block.name;
        initGlobalRTTIntrospection();

        if (window.rtt.rospackExists) {
          if (window.rtt.rosrunExists) {
            if (window.rtt.roboteamTacticsPackageExists) {
                var docs = window.rtt.process.exec("rosrun roboteam_tactics get_docs.py --of " + docTarget, {}, function(e, out, err) {
                  if (e) {
                    console.log("Err: " + err);
                    vm.block.docs = err;
                  } else {
                    console.log("Docs: " + out);
                    vm.block.docs = out;
                  }

                  // This make sure the change in vm is propagated correctly
                  $scope.$apply();
                });
            } else {
              vm.block.docs = "Package roboteam_tactics not found";
            }
          } else {
            vm.block.docs = "Command \"rosrun\" not present";
          }
        } else {
          vm.block.docs = "Command \"rospack\" not present";
        }
      } else {
        // Not running in electron! Do some default value stuff here
        console.log("Not running in electron or printdocs is false");
      }

    }

    function initGlobalRTTIntrospection() {
      if (window.rtt) return;

      console.log("Initializing RTT introspection");

      window.rtt = {}

      window.rtt.process = require('child_process');

      function commandExists(c) {
        try {
          window.rtt.process.execSync("hash " + c);
          return true;
        } catch (e) {
          return false;
        }
      }

      function packageExists(p) {
        try {
          window.rtt.process.execSync("rospack find " + p);
          return true;
        } catch (e) {
          return false;
        }
      }

      window.rtt.rospackExists = commandExists("rospack");
      window.rtt.rosrunExists = commandExists("rosrun");
      if (window.rtt.rospackExists) {
        window.rtt.roboteamTacticsPackageExists = packageExists("roboteam_tactics");
      } else {
        window.rtt.roboteamTacticsPackageExists = false;
      }
    }

    function _event(e) {
      setTimeout(function() {$scope.$apply(function() { _activate(); });}, 0);
      
    }
    function _create() {
      $window.editor.on('blockselected', _event);
      $window.editor.on('blockdeselected', _event);
      $window.editor.on('blockremoved', _event);
      $window.editor.on('treeselected', _event);
      $window.editor.on('nodechanged', _event);
    }
    function _destroy() {
      $window.editor.off('blockselected', _event);
      $window.editor.off('blockdeselected', _event);
      $window.editor.off('blockremoved', _event);
      $window.editor.off('treeselected', _event);
      $window.editor.off('nodechanged', _event);
    }

    function keydown(e) {
      if (e.ctrlKey && e.keyCode == 90) {
        e.preventDefault();
      }

      return false;
    }

    function update() {
      var p = $window.editor.project.get();
      var t = p.trees.getSelected();
      t.blocks.update(vm.original, vm.block);
    }
  }
})();
