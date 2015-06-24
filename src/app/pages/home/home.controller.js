(function() {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = [
  ];

  function HomeController() {
    var vm = this;

    _active();

    function _active() {
      // var e = document.getElementById('prld');
      // if (e) e.remove();
    }
  }

})()