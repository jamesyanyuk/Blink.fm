/**
 * A module for controller of recommendation list
 */

angular.module('recommendation', [])
  .controller('RecommendationCtrl', ['$scope', '$rootScope', 'socket', 'authSrv',
    function ($scope, $rootScope, socket, authSrv) {

      $scope.recVideos = [];
      $scope.hasCurrentUser = false;

      authSrv.getCurrentUser(function (currentUser) {
        if (currentUser && currentUser.username) {
          $scope.hasCurrentUser = true;
        }
      });

      socket.on('recommendation:updateRecVideos', function (videos) {
        $scope.recVideos = videos;
      });

      $scope.like = function (videoId) {
        socket.emit('recommendation:likeVideo', {
          videoId: videoId
        });
      };

      $scope.play = function (videoId) {
        $rootScope.player.loadVideoById(videoId);
        socket.emit('recommendation:removeVideo', {
          videoId: videoId
        });
      };
    }]);
