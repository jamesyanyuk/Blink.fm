/**
 * Created by tungpham31 on 2/5/15.
 */

angular.module('navBar')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/navBar/nav_bar.html'
    };
  });
