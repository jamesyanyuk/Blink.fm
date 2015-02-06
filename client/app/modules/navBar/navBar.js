/**
 * Created by tungpham31 on 1/21/15.
 *
 * A module for the navigation bar.
 */

var navBar = angular.module('navBar', ['auth']);

navBar.controller('NavBarCtrl', ['authSrv', '$scope', '$rootScope', '$modal',
  function (authSrv, $scope, $rootScope, $modal) {
    $scope.hasCurrentUser = false;
    authSrv.getCurrentUser(function (currentUser) {
      if (currentUser && currentUser.username) {
        $scope.hasCurrentUser = true;
      }
    });

    $rootScope.$on('/auth/login', function (event) {
      $scope.hasCurrentUser = true;
    });

    $rootScope.$on('/auth/logout', function (event) {
      $scope.hasCurrentUser = false;
    });

    $scope.logout = function () {
      authSrv.logout();
    };

    $scope.openWaitListModal = function () {
      $modal.open({
        templateUrl: 'modules/modals/waitlist_modal.html',
        controller: 'WaitListModalCtrl',
        size: 'sm'
      });
    };
  }]);

navBar.directive('navBar', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/navBar/nav_bar.html'
  };
});
