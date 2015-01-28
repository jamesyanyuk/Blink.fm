/**
 * Created by tungpham31 on 1/21/15.
 *
 * A module for the navigation bar.
 */

var navBar = angular.module('navBar', ['auth']);

navBar.controller('NavBarCtrl', ['authSrv', '$scope', '$rootScope', '$location', function(authSrv, $scope, $rootScope, $location) {
  $scope.hasCurrentUser = false;
  $scope.showSearchBar = $location.path() !== '/';

  authSrv.getCurrentUser(function (currentUser) {
    if (currentUser && currentUser.username) {
      $scope.hasCurrentUser = true;
      $scope.showSearchBar = true;
    }
  });

  $rootScope.$on('/auth/login', function(event) {
    $scope.hasCurrentUser = true;
    $scope.showSearchBar = true;
  });

  $rootScope.$on('/auth/logout', function(event) {
    $scope.hasCurrentUser = false;
    $scope.showSearchBar = false;
  });

  $scope.logout = function() {
    authSrv.logout();
  }
}]);

navBar.directive('navBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/navBar/nav_bar.html'
  };
});