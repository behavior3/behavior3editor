(function() {
  'use strict';

  angular
    .module('app')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = [
    '$state',
    '$window',
    'dialogService',
    'systemService', 
    'notificationService',
    'projectService'
  ];

  function ProjectsController($state,
                              $window,
                              dialogService, 
                              systemService,
                              notificationService,
                              projectService) {

    // HEAD //
    var vm = this;
    vm.recentProjects = [];
    vm.isDesktop = null;

    vm.newProject = newProject;
    vm.openProject = openProject;
    vm.editProject = editProject;
    vm.saveProject = saveProject;
    vm.closeProject = closeProject;
    vm.removeProject = removeProject;

    _activate();

    // BODY //
    function _activate() {
      vm.isDesktop = systemService.isDesktop;
      projectService
        .getRecentProjects()
        .then(function(recents) {
          vm.recentProjects = recents;
        })
    }

    function _newProject(path, name) {
      projectService
        .newProject(path, name)
        .then(function() {
          $state.go('editor');
        })
    }

    function newProject() {
      function doNew() {
        // Get project name
        dialogService
          .prompt('New project', null, 'input', 'Project name')
          .then(function(name) {
            // If no name provided, abort
            if (!name) {
              notificationService.error(
                'Invalid name',
                'You must provide a name for the project.'
              )
              return;
            }

            // If desktop, open file dialog
            if (vm.isDesktop) {
              var placeholder = name.replace(/\s+/g, "_").toLowerCase();

              dialogService
                .saveAs(placeholder, ['.b3', '.json'])
                .then(function(path) {
                  _newProject(path, name);
                })
            } else {
              var path = 'b3projects-'+b3.createUUID();  
              _newProject(path, name);
            }
          });
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            'Leave without saving?', 
            'If you proceed you will lose all unsaved modifications.', 
            null, {closeOnConfirm: false})
          .then(doNew)
      } else {
        doNew();
      }
    }

    function _openProject(path) {
      projectService
        .openProject(path)
        .then(function() {
          $state.go('editor');
        }, function() {
          notificationService.error(
            'Invalid file',
            'Couldn\'t open the project file.'
          )
        })
    }
    function openProject(path) {
      function doOpen() {
        if (path) {
          _openProject(path);
        } else {
          dialogService
            .openFile(false, ['.b3', '.json'])
            .then(function(path) {
              _openProject(path);
            });
        }
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            'Leave without saving?', 
            'If you proceed you will lose all unsaved modifications.')
          .then(doOpen)
      } else {
        doOpen();
      }
    }

    function editProject() {
      var project = projectService.getProject();

      dialogService
        .prompt('Rename project', null, 'input', project.name)
        .then(function(name) {
          // If no name provided, abort
          if (!name) {
            notificationService.error(
              'Invalid name',
              'You must provide a name for the project.'
            )
            return;
          }

          project.name = name;
          projectService
            .saveProject(project)
            .then(function() {
              _activate();
              notificationService.success(
                'Project renamed',
                'The project has been renamed successfully.'
              )
            })
        });
    }

    function saveProject() {
      projectService
        .saveProject()
        .then(function() {
          notificationService.success(
            'Project saved',
            'The project has been saved'
          )
        }, function() {
          notificationService.error(
            'Error',
            'Project couldn\'t be saved'
          )
        })
    }

    function closeProject() {
      function doClose() {
        projectService.closeProject();
      }

      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            'Leave without saving?', 
            'If you proceed you will lose all unsaved modifications.', 
            null)
          .then(doClose)
      } else {
        doClose();
      }
    }

    function removeProject(path) {
      dialogService.
        confirm(
          'Remove project?', 
          'Are you sure you want to remove this project?'
        ).then(function() {
          projectService
            .removeProject(path)
            .then(function() {
              _activate();
              notificationService.success(
                'Project removed',
                'The project has been removed from editor.'
              );
            })
        })
    }
  }
})();