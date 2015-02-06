/**
 * A module for controller of recommendation list
 */

angular.module('recommendation', [])
  .controller('RecommendationCtrl', ['$scope', '$rootScope', '$location', 'socket', 'authSrv',
    function ($scope, $rootScope, $location, socket, authSrv) {

      $scope.recVideos = [];
      $scope.isBroadcaster = false;
      $scope.like = like;
      $scope.play = play;
      $scope.addToQueue = addToQueue;

      authSrv.getCurrentUser(function (currentUser) {
        if (currentUser && currentUser.username) {
          $scope.isBroadcaster = (currentUser.username === getRadioIdFromPath($location.path()))
        }
      });
      function getRadioIdFromPath(path) {
        return path.substring(1);
      }

      socket.on('recommendation:updateRecVideos', function (videos) {
        $scope.recVideos = videos;
      });

      function like(videoId) {
        socket.emit('recommendation:likeVideo', {
          videoId: videoId
        });
      }

      function play(videoId) {
        $rootScope.player.loadVideoById(videoId);
        socket.emit('recommendation:removeVideo', {
          videoId: videoId
        });
      }

      function addToQueue(video) {
        $rootScope.playingQueue.push(video);
        socket.emit('recommendation:removeVideo', {
          videoId: video.videoId
        });
      }
    }]);
