'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('MainCtrl', ['$analytics', '$scope', 'authSrv', 'gAnalytics',
    function ($analytics, $scope, authSrv, gAnalytics) {
      gAnalytics.track();

      $scope.viewerCount = 0;

      authSrv.getCurrentUser(function (currentUser) {
        $scope.currentUser = currentUser;
      });

      socket.on('update_viewer_count', function (data) {
        $scope.viewerCount = data.count;
        $scope.$apply();
      });
    }]);
