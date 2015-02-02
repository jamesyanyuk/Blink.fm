'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('MainCtrl', ['$scope', 'authSrv',
    function ($scope, authSrv) {
      $scope.viewerCount = 0;

      authSrv.getCurrentUser(function (currentUser) {
        $scope.currentUser = currentUser;
      });

      socket.on('update_viewer_count', function (data) {
        $scope.viewerCount = data.count;
        $scope.$apply();
      });
    }]);
