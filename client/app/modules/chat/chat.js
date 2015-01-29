/**
 * A module handling the controller and view for the chat feature.
 */
var chat = angular.module('chat', ['auth']);

chat.controller('ChatCtrl', ['$scope', '$rootScope', '$routeParams', 'socket', 'authSrv', 'nicknameSrv',
  function ($scope, $rootScope, $routeParams, socket, authSrv, nicknameSrv) {
    $rootScope.radioid = $scope.radioId = $routeParams.username;

    $scope.chat = {}
    $scope.chat.messages = [];
    $scope.$parent.isBroadcasterConnected = true;

    // Check if current user has nickname, otherwise, open modal to ask for user's nickname.
    authSrv.getNicknameAsync().catch(function () {
      nicknameSrv.openNicknameModal(socket);
    });

    authSrv.getCurrentUser(function (user) {
      if (user && user.username) {
        socket.emit('join_radio', {
          radioid: $rootScope.radioid,
          username: user.username,
          isBroadcaster: user.username === $rootScope.radioid
        });
      } else {
        socket.emit('join_radio', {
          radioid: $rootScope.radioid,
          isBroadcaster: false,
          username: null
        });
      }
    });

    $scope.chat.send = function () {
      var nickname = authSrv.getNickname();
      if (nickname && $scope.chat.message) {
        socket.emit('send_message', {
          nickname: nickname,
          radioid: $rootScope.radioid,
          message: $scope.chat.message
        });
        $scope.chat.message = '';
      }
    }

    socket.on('update_chat', function (data) {
      $scope.chat.messages.push(data.message);
    });

    socket.on('update_broadcaster_status', function (data) {
      $scope.$parent.isBroadcasterConnected = data.isBroadcasterConnected;
    });
  }]);

chat.directive('chatWindow', function () {
  return {
    restrict: 'E',
    templateUrl: 'modules/chat/chat.html'
  };
});

// Used to scroll the chat display individually from the entire chatWindow directive
chat.directive('chatOutput', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      scope.$watchCollection(attr.chatOutput, function () {
        element[0].scrollTop = element[0].scrollHeight;
      });
    }
  };
});
