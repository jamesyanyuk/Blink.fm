/**
 * Created by tungpham31 on 2/5/15.
 */

(function () {
  'use strict';

  angular
    .module('navBar')
    .directive('navBar', navBar);

  navBar.$inject = [];

  /* @ngInject */
  function navBar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'modules/navBar/nav_bar.html'
    };
    return directive;
  }

})();
