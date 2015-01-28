angular.module('chat').factory('nicknameSrv', ['$rootScope', '$modal', '$q', 'authSrv', function ($rootScope, $modal, $q, authSrv) {
  return {
    openNicknameModal: function (socket) {
      var deferred = $q.defer();

      var modalInstance = $modal.open({
        templateUrl: 'modules/chat/nickname_modal.html',
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
