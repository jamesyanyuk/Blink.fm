'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('apollonApp')
  .factory('socket', function(socketFactory) {
    return socketFactory();
  })
  .controller('MainCtrl', ['$scope', '$routeParams', 'socket', function ($scope, $routeParams, socket) {
    $scope.radioid = $routeParams.username;

    $scope.chat = {}
    $scope.chat.messages = [];

    socket.emit('join_radio', {
      radioid: $scope.radioid
    });

    $scope.chat.verify = function() {
      if(!$scope.nickname) {
        console.log('Requesting nickname from nickname modal module..');
        $scope.open(socket);
      }
    }

    $scope.chat.send = function() {
      if(!$scope.nickname)
        verify();
      else if($scope.chat.message) {
        socket.emit('sendmessage', {
          nickname: $scope.nickname,
          radioid: $scope.radioid,
          message: $scope.chat.message
        });
        $scope.chat.message = '';
      }
    }

    socket.on('updatechat', function(data) {
      $scope.chat.messages.push(data.message);
    });
  }]);
