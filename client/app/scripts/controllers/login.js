'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('LoginCtrl', function ($scope, $http, $location, $window, authSrv) {
    $scope.login = {};
    $scope.login.user = {};
    $scope.message = '';

    $scope.login.submit = function () {
      if (!$scope.login.user.username || !$scope.login.user.password) {
        $scope.message = 'Field(s) left blank.';
        return false;
      } else {
        $scope.message = '';
      }

      authSrv.login($scope.login.user).then(
        function (data) {
          // After logging in, redirect users to their own radio station.
          $location.path($scope.login.user.username);
          // Enforce a full page reload for YouTube player to work correctly.
          $window.location.reload();
        },
        function (data) {
          console.log('Login failure.');
        }
      );
    }
  });
