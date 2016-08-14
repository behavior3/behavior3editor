// ==========================================================================
// HEADER
// ==========================================================================
angular.module('behavior3.pages.home', [])
       .controller('behavior3HomeController', HomeController)
       .directive('behavior3Home', HomeDirective);

HomeDirective.$inject = [];
function HomeDirective() {
  return {
    templateUrl  : 'app/pages/home/home.template.html',
    controller   : HomeController,
    controllerAs : 'c_home'
  };
}



// ==========================================================================
// CONTROLLER
// ==========================================================================
HomeController.$inject = ['$scope'];
function HomeController($scope) {
  $scope.$on('$destroy', _destroy);

  var self = this;
  _initialize();

  function _initialize() {
    self.stub_biglist = ('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.').split(' ');
  }

  function _destroy() {

  }

}
