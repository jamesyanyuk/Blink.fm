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
    var radioid = $scope.radioid = $routeParams.username;
    var nickname = $scope.nickname;

    $scope.chat = {}
    $scope.chat.messages = [];

    socket.emit('join_radio', {
      nickname: 'Test',
      radioid: radioid
    });

    $scope.chat.verify = function() {
      //if(!nickname) {
      //
      //}
    }

    $scope.chat.send = function() {
      if($scope.chat.message) {
        socket.emit('sendmessage', {
          nickname: 'Test',
          radioid: radioid,
          message: $scope.chat.message
        });
        $scope.chat.message = '';
      }
    }

    socket.on('updatechat', function(data) {
      $scope.chat.messages.push(data.message);
    });
  }]);
