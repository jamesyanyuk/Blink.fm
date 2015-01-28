'use strict';

var nickname = angular.module('nicknameModal', ['auth']);

/**
 * @ngdoc function
 * @name clientApp.controller:NicknameModalCtrl
 * @description
 * # NicknameModalCtrl
 * Controller of the clientApp
 */

nickname.controller('NicknameModalCtrl', function ($scope, $rootScope, $modal, authSrv) {
});

nickname.controller('NicknameModalInstanceCtrl', function ($scope, $modalInstance) {
  $scope.message = '';
  $scope.submit = function () {
    if ($scope.nickname) {
      $modalInstance.close($scope.nickname);
    } else {
      $scope.message = 'Nickname cannot be empty!'
    }
  };
});

nickname.factory('nicknameSrv', ['$rootScope', '$modal', '$q', 'authSrv', function ($rootScope, $modal, $q, authSrv) {
  return {
    openNicknameModal: function (socket) {
      var deferred = $q.defer();

      var modalInstance = $modal.open({
        templateUrl: 'modules/modals/nickname_modal.html',
        controller: 'NicknameModalInstanceCtrl',
        backdrop: 'static',
        size: 'sm'
      });

      modalInstance.result.then(
        function (nickname) {
          if (nickname) {
            authSrv.setNickname(nickname);
            socket.emit('announce_join', {
              nickname: nickname,
              radioid: $rootScope.radioid
            });
            deferred.resolve(nickname);
          }
          else deferred.reject();
        },
        function () {
          deferred.reject();
        }
      );

      return deferred.promise;
    }
  }
}]);
