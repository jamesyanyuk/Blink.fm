'use strict';

var myApp = angular.module('nicknameModal', []);

/**
 * @ngdoc function
 * @name clientApp.controller:NicknameModalCtrl
 * @description
 * # NicknameModalCtrl
 * Controller of the clientApp
 */

myApp.controller('NicknameModalCtrl', function ($scope, $modal) {
  $scope.open = function(socket) {
    var modalInstance = $modal.open({
      templateUrl: 'nicknameModal.html',
      controller: 'NicknameModalInstanceCtrl',
      size: 'sm'
    });

    modalInstance.result.then(function(nickname) {
      console.log('noooooooo\n\n');
      $scope.$parent.nickname = nickname;

      socket.emit('announce_join', {
        nickname: $scope.nickname,
        radioid: $scope.$parent.radioid
      });
    });
  }

  $scope.$parent.open = $scope.open;
});

myApp.controller('NicknameModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.submit = function() {
    $modalInstance.close($scope.nickname);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
