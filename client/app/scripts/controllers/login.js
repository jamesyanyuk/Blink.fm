'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('LoginCtrl', function ($scope, $http, $location, authSrv) {
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
          $location.path("/" + $scope.login.user.username);
        },
        function (data) {
          console.log('Login failure.');
        }
      );
    }
  });
