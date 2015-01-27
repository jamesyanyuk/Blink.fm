'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('MainCtrl', ['$scope', '$routeParams', '$location', '$window', 'authSrv',
    function ($scope, $routeParams, $location, $window, authSrv) {
      // Enforce a full page reload for YouTube player to work correctly.
      if (!$routeParams.reload) {
        $location.search('reload', 1);
        $window.location.href = $window.location.href + "?reload=1";
        $window.location.reload();
      }

      authSrv.getCurrentUser(function (currentUser) {
        $scope.currentUser = currentUser;
      });
    }]);
