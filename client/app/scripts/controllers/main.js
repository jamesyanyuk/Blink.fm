'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp', ['btford.socket-io'])
  .factory('socket', function(socketFactory) {
    return socketFactory();
  })
  .controller('MainCtrl', ['$scope', 'socket', function ($scope, socket) {
    socket.on('connect', function(data) {
      
    })
  }]);
