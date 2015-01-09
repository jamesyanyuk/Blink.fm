'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('LoginCtrl', function ($scope, $http) {
    $scope.login = {};
    $scope.login.user = {};
    $scope.message = '';

    $scope.login.submit = function() {
      if(!$scope.login.user.username || !$scope.login.user.password) {
        $scope.message = 'Field(s) left blank.';
        return false;
      }

      console.log($scope.signup.user);

      $http.post('/login', $scope.login.user)
        .success(function(data) {
          console.log('Login success.');
        })
        .error(function(data) {
          console.log('Login failure.');
        });
    }
  });
