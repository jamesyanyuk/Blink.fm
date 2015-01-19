var myApp = angular.module('Chat', []);

myApp.controller('ChatCtrl', ['$scope', '$rootScope', '$routeParams', 'socket', 'authSrv',
  function ($scope, $rootScope, $routeParams, socket, authSrv) {
    $rootScope.radioid = $routeParams.username;

    $scope.chat = {}
    $scope.chat.messages = [];
    $scope.hostStatus = 'online';

    authSrv.getCurrentUser(function (user) {
      if (user && user.username) {
        $rootScope.nickname = user.username;
        socket.emit('join_radio', {
          radioid: $rootScope.radioid,
          nickname: user.username
        });
      } else {
        socket.emit('join_radio', {
          radioid: $rootScope.radioid
        });
      }
    });

    $scope.chat.verify = function () {
      if (!$rootScope.nickname) {
        console.log('Requesting nickname from nickname modal module..');
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

    socket.on('host_status', function (data){
      if (data.isConnected){
        $scope.hostStatus = 'online';
      } else {
        $scope.hostStatus = 'offline';
      }
      console.log($scope.hostStatus);
    });
  }]);
