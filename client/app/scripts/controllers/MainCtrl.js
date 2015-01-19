'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('MainCtrl', ['$scope', 'authSrv', function ($scope, authSrv) {
    authSrv.getCurrentUser(function (currentUser) {
      $scope.currentUser = currentUser;
    });
  }]);
