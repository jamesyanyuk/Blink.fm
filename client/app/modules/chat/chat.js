var myApp = angular.module('Chat', []);

myApp.controller('ChatCtrl', ['$scope', '$rootScope', '$routeParams', 'socket', 'authSrv', function ($scope, $rootScope, $routeParams, socket, authSrv) {
  $rootScope.radioid = $routeParams.username;

  $scope.chat = {}
  $scope.chat.messages = [];

  authSrv.getCurrentUser(function(user){
    if (user && user.username){
      $rootScope.nickname = user.username;  
    }
  });
  // var userObj = JSON.parse(sessionStorage.getItem("currentUser"));
  // if(userObj)
  //   $rootScope.nickname = userObj.username;

  socket.emit('join_radio', {
    radioid: $rootScope.radioid
  });

  $scope.chat.verify = function() {
    if(!$rootScope.nickname) {
      console.log('Requesting nickname from nickname modal module..');
      $rootScope.openNicknameModal(socket);
    }
  }

  $scope.chat.send = function() {
    if(!$rootScope.nickname)
      verify();
    else if($scope.chat.message) {
      socket.emit('send_message', {
        nickname: $rootScope.nickname,
        radioid: $rootScope.radioid,
        message: $scope.chat.message
      });
      $scope.chat.message = '';
    }
  }

  socket.on('update_chat', function(data) {
    $scope.chat.messages.push(data.message);
  });
}]);
