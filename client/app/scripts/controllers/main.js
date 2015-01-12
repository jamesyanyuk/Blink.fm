'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .factory('socket', function (socketFactory) {
    return socketFactory();
  })
  .controller('MainCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.chat = {}
    $scope.chat.send = function () {
      if ($scope.chat.message) {
        socket.emit('sendmessage', {
          // todo
          message: $scope.chat.message
        });
        $scope.chat.message = '';
      }
    }

    socket.on('connect', function (data) {
      socket.emit('join_radio', {
        // todo: transmit user nickname
      });
    });

    socket.on('updatechat', function (data) {
      // todo: add received message
    });

    socket.on('client_connect', function (data) {
      // todo: add c message
    });

    socket.on('client_disconnect', function (data) {
      // todo: add dc message
    });
  }]);
