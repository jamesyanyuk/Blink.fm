'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $http, $location, $window, authSrv, loginMethods) {
    // Check authentication.
    authSrv.checkAuth();

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

      authSrv.login(loginMethods.local, $scope.login.user).then(
        function (data) {
          if (data.user){
            // After logging in, redirect users to their own radio channel.
            $location.path(data.user.username).replace();
            // Enforce a full page reload for YouTube player and the nav bar to work correctly.
            $window.location.reload();
          } else {
            $scope.message = 'Incorrect username/password.';
          }
        },
        function (data) {
          $scope.message = 'Error logging in.';
        }
      );
    };

    $scope.login.facebook = function () {
      authSrv.login(loginMethods.fb);
    };
  });
