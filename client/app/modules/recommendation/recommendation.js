/**
 * A module for controller of recommendation list
 */

angular.module('recommendation', [])
  .controller('RecommendationCtrl', ['$scope', '$rootScope', 'socket', 'authSrv',
    function ($scope, $rootScope, socket, authSrv) {

      $scope.recVideos = [];
      $scope.hasCurrentUser = false;

      $scope.$on('$locationChangeSuccess', function (event) {
        console.log(event);
      });

      authSrv.getCurrentUser(function (currentUser) {
        if (currentUser && currentUser.username) {
          $scope.hasCurrentUser = true;
        }
      });

      socket.on('recommendation:updateRecVideos', function (data) {
        $scope.recVideos = data;
      });

      $scope.like = function (videoId) {
        socket.emit('recommendation:likeVideo', {
          id: videoId
        });
      };

      $scope.play = function (videoId) {
        $rootScope.player.loadVideoById(videoId);
        socket.emit('recommendation:removeVideo', {
          id: videoId
        });
      };
    }]);
