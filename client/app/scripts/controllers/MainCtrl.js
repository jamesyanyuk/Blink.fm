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
    '$window',
    '$location',
    '$routeParams',
    '$scope',
    'authSrv',
    'gAnalytics',
    'socket'
  ];

  /* @ngInject */
  function MainCtrl($window, $location, $routeParams, $scope, authSrv, gAnalytics, socket) {
    _enforcePageReloadOnce();

    if ($routeParams.reload) {
      gAnalytics.pageTrack('/' + $routeParams.username);
    }

    $scope.viewerCount = 0;

    authSrv.getCurrentUser(function (currentUser) {
      $scope.currentUser = currentUser;
    });

    socket.on('update_viewer_count', function (data) {
      $scope.viewerCount = data.count;
      $scope.$apply();
    });

    ////////////////

    /*
     Enforce a full page reload once for YouTube player to work correctly.
     */
    function _enforcePageReloadOnce() {
      if (!$routeParams.reload) {
        $location.search('reload', 1);
        $window.location.href = $window.location.href + "?reload=1";
        $window.location.reload();
      }
    }
  }
})();
