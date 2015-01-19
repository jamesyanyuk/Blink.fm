'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .controller('MainCtrl', ['$scope', '$rootScope', 'authSrv', function ($scope, $rootScope, authSrv) {
    authSrv.getCurrentUser(function (currentUser) {
      $scope.currentUser = currentUser;
    });
  }]);
