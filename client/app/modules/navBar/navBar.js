/**
 * Created by tungpham31 on 1/21/15.
 *
 * A module for the navigation bar.
 */

var navBar = angular.module('navBar', ['auth']);

navBar.controller('NavBarCtrl', ['authSrv', '$scope', function (authSrv, $scope) {
  $scope.hasCurrentUser = false;
  authSrv.getCurrentUser(function (currentUser) {
    if (currentUser && currentUser.username) {
      $scope.hasCurrentUser = true;
    }
  });

  $scope.logout = function () {
    authSrv.logout();
  }
}]);

navBar.directive('navBar', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/navBar/nav_bar.html'
  };
});
