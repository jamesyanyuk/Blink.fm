/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 * Created by tungpham31 on 2/6/15.
 */

(function () {
  'use strict';

  angular
    .module('apollonApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = [
    '$scope',
    'authSrv',
    'gAnalytics',
    'socket'
  ];

  /* @ngInject */
  function MainCtrl($scope, authSrv, gAnalytics, socket) {
    gAnalytics.keepSessionAlive();

    $scope.viewerCount = 0;

    authSrv.getCurrentUser(function (currentUser) {
      $scope.currentUser = currentUser;
    });

    socket.on('update_viewer_count', function (data) {
      $scope.viewerCount = data.count;
      $scope.$apply();
    });

    ////////////////
  }
})();
