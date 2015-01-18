'use strict';

var nickname = angular.module('nicknameModal', []);

/**
 * @ngdoc function
 * @name clientApp.controller:NicknameModalCtrl
 * @description
 * # NicknameModalCtrl
 * Controller of the clientApp
 */

nickname.controller('NicknameModalCtrl', function ($scope, $rootScope, $modal) {
  $rootScope.openNicknameModal = function(socket) {
    var modalInstance = $modal.open({
      templateUrl: 'nicknameModal.html',
      controller: 'NicknameModalInstanceCtrl',
      size: 'sm'
    });

    modalInstance.result.then(function(nickname) {
      $rootScope.nickname = nickname;

      socket.emit('announce_join', {
        nickname: $rootScope.nickname,
        radioid: $rootScope.radioid
      });
    });
  }
});

nickname.controller('NicknameModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.submit = function() {
    $modalInstance.close($scope.nickname);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
