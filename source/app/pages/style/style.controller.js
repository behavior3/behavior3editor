// ==========================================================================
// HEADER
// ==========================================================================
angular.module('behavior3.pages.style', [])
       .controller('behavior3StyleController', StyleController)
       .directive('behavior3Style', StyleDirective);

StyleDirective.$inject = [];
function StyleDirective() {
  return {
    templateUrl  : 'app/pages/style/style.template.html',
    controller   : StyleController,
    controllerAs : 'c_style'
  };
}



// ==========================================================================
// CONTROLLER
// ==========================================================================
StyleController.$inject = ['$scope'];
function StyleController($scope) {
  $scope.$on('$destroy', _destroy);

  var self = this;
  _initialize();

  function _initialize() {

  }

  function _destroy() {

  }

}
