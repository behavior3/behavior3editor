angular
  .module('app')
  .factory('notificationService', notificationService);

notificationService.$inject = ['$window', '$timeout', '$compile', '$rootScope', '$sce'];

function notificationService($window, $timeout, $compile, $rootScope, $sce) {
  var elementBuffer = [];
  var service = {
    notify  : notify,
    simple  : simple,
    success : success,
    error   : error,
    info    : info,
    warning : warning,
  };
  return service;

  function _reposite() {
    var verticalSpacing = 10;
    var lastBottom = 20;

    for(var i=elementBuffer.length-1; i>=0; i--) {
      var element = elementBuffer[i];
      var height = parseInt(element[0].offsetHeight);
      
      var bottom = lastBottom;
      lastBottom = bottom+height+verticalSpacing;

      element.css('bottom', bottom+'px');
    }
  }

  function _note(config) {
    var TEMPLATE = ''+
    '<div class="notification" ng-class="type">'+
    '  <div class="notification-icon" ng-show="icon"><i class="fa fa-fw" ng-class="icon"></i></div>'+
    '  <div class="notification-content" ng-class="{\'has-icon\': icon}">' +
    '    <div class="notification-title" ng-show="title" ng-bind-html="title"></div>'+
    '    <div class="notification-message" ng-bind-html="message"></div>'+
    '  </div>' +
    '</div>';

    var DEFAULT = {
      type    : 'default',
      title   : '',
      message : '',
      icon    : false,
      delay   : 3000,
    }

    // Default parameters
    config = tine.merge({}, DEFAULT, config);

    // Set scope variables to fill the template
    var scope = $rootScope.$new();
    scope.type = config.type;
    scope.title = $sce.trustAsHtml(config.title);
    scope.message = $sce.trustAsHtml(config.message);
    scope.icon = config.icon;
    scope.delay = config.delay;

    // Create the DOM element and add events
    var element = $compile(TEMPLATE)(scope);
    element.bind('webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd click', function(e) {
      e = e.originalEvent || e;
      if (e.type==='click' || element.hasClass('killed')) {
        element.remove();
        elementBuffer.remove(element);
        _reposite();
      }
    });

    if (angular.isNumber(config.delay)) {
      $timeout(function() {
        element.addClass('killed');
      }, config.delay);
    }
    
    $timeout(function() {
      element.addClass('started');
      _reposite();
    }, 0);

    elementBuffer.push(element);
    angular.element(document.getElementsByTagName('body')).append(element);
  }

  function notify(config) {
    _note(config);
  }
  function simple(title, message) {
    _note({title:title, message:message, type:'default'});
  }
  function success(title, message) {
    _note({title:title, message:message, icon:'fa-check', type:'success'});
  }
  function error(title, message) {
    _note({title:title, message:message, icon:'fa-close', type:'error'});
  }
  function info(title, message) {
    _note({title:title, message:message, icon:'fa-info', type:'info'});
  }
  function warning(title, message) {
    _note({title:title, message:message, icon:'fa-warning', type:'warning'});
  }
}