'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('LoginCtrl', function($scope, $rootScope, $http, $location, $window, authSrv) {
    $scope.login = {};
    $scope.login.user = {};
    $scope.message = '';

    $scope.login.submit = function() {
      if (!$scope.login.user.username || !$scope.login.user.password) {
        $scope.message = 'Field(s) left blank.';
        return false;
      } else {
        $scope.message = '';
      }
      $http.post('/auth/login', $scope.login.user)
        .success(function(data) {
          console.log(data);
          if (data.user){
            // After logging in, redirect users to their own radio station.
            $location.path(data.user.username).replace();
            // Enforce a full page reload for YouTube player to work correctly.
            // Note: Unnecessary
            //$window.location.reload();
          } else {
            $scope.message = 'Incorrect username/password.';
            console.log('Login failure.');
          }
        })
        .error(function (data) {
          $scope.message = 'Error logging in.';
          console.log('Login failure.');
        });
    };

    $scope.login.facebook = function() {
      $window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "auth/facebook";
  });
