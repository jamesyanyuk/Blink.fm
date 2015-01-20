/**
 * A module handling the controller and view for the chat feature.
 */
var chat = angular.module('chat', []);

chat.controller('ChatCtrl', ['$scope', '$rootScope', '$routeParams', 'socket', 'authSrv',
  function ($scope, $rootScope, $routeParams, socket, authSrv) {
    $rootScope.radioid = $scope.radioId = $routeParams.username;

    $scope.chat = {}
    $scope.chat.messages = [];
    $scope.isBroadcasterConnected = true;

    authSrv.getCurrentUser(function (user) {
      if (user && user.username) {
        $rootScope.nickname = user.username;
        socket.emit('join_radio', {
          radioid: $rootScope.radioid,
          isBroadcaster: user.username === $rootScope.radioid
        });
      } else {
        socket.emit('join_radio', {
          radioid: $rootScope.radioid
        });
      }
    });

    $scope.chat.verify = function () {
      if (!$rootScope.nickname) {
        $rootScope.openNicknameModal(socket);
      }
    }

    $scope.chat.send = function () {
      if (!$rootScope.nickname)
        verify();
      else if ($scope.chat.message) {
        socket.emit('send_message', {
          nickname: $rootScope.nickname,
          radioid: $rootScope.radioid,
          message: $scope.chat.message
        });
        $scope.chat.message = '';
      }
    }

    socket.on('update_chat', function (data) {
      $scope.chat.messages.push(data.message);
    });

    socket.on('update_broadcaster_status', function (data){
      $scope.isBroadcasterConnected = data.isBroadcasterConnected;
    });
  }]);

chat.directive('chatWindow', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/chat/chat.html'
  };
});
