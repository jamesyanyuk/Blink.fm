angular
  .module('youtube')
  .controller('YouTubeCtrl', function ($scope, $rootScope, YT_event, authSrv, socket) {
  //initial settings
  $scope.yt = {
    width: angular.element(".video-container").width(),
    height: angular.element(".video-container").height(),
    playerStatus: "NOT PLAYING"
  };

  $scope.YT_event = YT_event;

  $scope.sendControlEvent = function (ctrlEvent) {
    this.$broadcast(ctrlEvent);
  }

  $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
    $scope.yt.playerStatus = data;
  });

  var currentUser = null;
  authSrv.getCurrentUser(function (user) {
    currentUser = user;
    // Changed polling rate to 500, since we're not expecting much load for the MVP
    if (currentUser) {
      setInterval(function () {
        if ($scope.isPlayerReady) {
          socket.emit('broadcast_player_status', {
            radioId: currentUser.username,
            videoId: $rootScope.player.getVideoData().video_id,
            videoUrl: $rootScope.player.getVideoUrl(),
            currentTime: $rootScope.player.getCurrentTime(),
            playerState: $rootScope.player.getPlayerState()
          });
        }
      }, 500);
    }
  });

  socket.on('update_player_status', function (data) {
    if ($rootScope.player) {
      if ($rootScope.player.getVideoUrl() !== data.videoUrl) {
        if (data.playerState === YT_event.PLAY) {
          $rootScope.player.loadVideoById(data.videoId, data.currentTime);
        } else {
          $rootScope.player.cueVideoById(data.videoId, data.currentTime);
        }
      } else {
        if (Math.abs(data.currentTime - $rootScope.player.getCurrentTime()) > 10) {
          $rootScope.player.seekTo(data.currentTime);
        }
        if (data.playerState === YT_event.PLAY) {
          $rootScope.player.playVideo();
        }
        if (data.playerState === YT_event.PAUSE) {
          $rootScope.player.pauseVideo();
        }
      }
    }
  });

  socket.on('update_broadcaster_status', function (data) {
    if ($rootScope.player) {
      if (!data.isBroadcasterConnected) {
        $rootScope.player.loadVideoById(null); // hacky way to stop the radio.
      } else {
        $rootScope.player.playVideo();
      }
    }
  });

});
