angular.module('chat')
  .factory('nicknameSrv', ['$rootScope', '$modal', '$q', 'socket', function ($rootScope, $modal, $q, socket) {
    return {
      openNicknameModal: function () {
        var deferred = $q.defer();

        var modalInstance = $modal.open({
          templateUrl: 'modules/chat/nickname_modal.html',
          controller: 'NicknameModalInstanceCtrl',
          backdrop: 'static',
          keyboard: false,
          size: 'sm'
        });

        modalInstance.result.then(
          function (nickname) {
            if (nickname) {
              socket.emit('announce_join', {
                nickname: nickname,
                radioid: $rootScope.radioid
              });
              deferred.resolve(nickname);
            }
            else deferred.reject();
          },
          function (error) {
            deferred.reject(error);
          }
        );

        return deferred.promise;
      }
    }
  }]);
