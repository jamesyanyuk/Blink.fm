'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('SignupCtrl', function ($scope, $http) {
    $scope.signup = {};
    $scope.signup.user = {};
    $scope.message = '';

    $scope.signup.submit = function() {
      if(!$scope.signup.user.username || !$scope.signup.user.password) {
        $scope.message = 'Field(s) left blank.';
        return false;
      }

      console.log($scope.signup.user);

      $http.post('/signup', $scope.signup.user)
        .success(function(data) {
          console.log('Signup success.');
        })
        .error(function(data) {
          console.log('Signup failure.');
        });
    }
  });
