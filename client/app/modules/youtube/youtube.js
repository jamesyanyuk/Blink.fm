var myApp = angular.module('YouTubeApp', ['auth']);

myApp.constant('YT_event', {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
  STATUS_CHANGE: 3
});

myApp.controller('YouTubeCtrl', function ($scope, $rootScope, YT_event, authSrv, socket) {
  //initial settings
  $scope.yt = {
    width: angular.element(".video-container").width(),
    // 5:3 aspect ratio
    height: angular.element(".video-container").height(),
    //videoid: "KRaWnd3LJfs", default video for testing purpose.
    playerStatus: "NOT PLAYING"
  };

  angular.element(window).bind('resize',function() {
    $rootScope.player.setSize(angular.element(".video-container").width(),
                      angular.element(".video-container").height());
  });

  $scope.YT_event = YT_event;

  $scope.sendControlEvent = function (ctrlEvent) {
    this.$broadcast(ctrlEvent);
  }

  $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
    $scope.yt.playerStatus = data;
  });

  authSrv.getCurrentUser(function(currentUser){
    // Changed polling rate to 500, since we're not expecting much load for the MVP
    if (currentUser) {
      setInterval(function () {
        if ($scope.isPlayerReady) {
          socket.emit('broadcast_player_status', {
            radioId: currentUser.username,
            videoId: (function () {
              var videoIdRes = $rootScope.player.getVideoUrl().match(/[?&]v=([^&]+)/);

              if (videoIdRes && videoIdRes.length > 1)
                return videoIdRes[1];
              else
                return undefined;
            })(),
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

  socket.on('update_broadcaster_status', function (data){
    if ($rootScope.player){
      if (!data.isBroadcasterConnected){
        $rootScope.player.loadVideoById(null); // hacky way to stop the radio.
      } else {
        $rootScope.player.playVideo();
      }
    }
  });

});

myApp.directive('youtube', function ($window, YT_event, $rootScope, $http) {
  return {
    restrict: "E",

    template: '<div></div>',

    link: function (scope, element, attrs) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      scope.isPlayerReady = false;
      $window.onYouTubeIframeAPIReady = function () {
        $rootScope.player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 0,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 0,
            controls: 1
          },

          height: scope.yt.height,
          width: scope.yt.width,
          videoId: scope.yt.videoid,

          events: {
            'onStateChange': function (event) {

              var message = {
                event: YT_event.STATUS_CHANGE,
                data: ""
              };

              switch (event.data) {
                case YT.PlayerState.PLAYING:
                  message.data = "PLAYING";
                  break;
                case YT.PlayerState.ENDED:
                  message.data = "ENDED";
                  break;
                case YT.PlayerState.UNSTARTED:
                  message.data = "NOT PLAYING";
                  break;
                case YT.PlayerState.PAUSED:
                  message.data = "PAUSED";
                  break;
              }

              scope.$apply(function () {
                scope.$emit(message.event, message.data);
              });
            },

            'onReady': function (event) {
              scope.isPlayerReady = true;
            }
          }
        });
      };

      scope.$watch('yt.videoid', function (newValue, oldValue) {
        if (newValue == oldValue) {
          return;
        }

        $rootScope.player.cueVideoById(scope.yt.videoid);
      });

      scope.$on(YT_event.STOP, function () {
        $rootScope.player.seekTo(0);
        $rootScope.player.stopVideo();
      });

      scope.$on(YT_event.PLAY, function () {
        $rootScope.player.playVideo();
      });

      scope.$on(YT_event.PAUSE, function () {
        $rootScope.player.pauseVideo();
      });

      scope.$on(YT_event.STATUS_CHANGE, function (event, message) {
        if (message === "ENDED") {
          $http.get('recommendation-engine/next').success(function (response) {
            if (response && response.videoId) {
              $rootScope.player.loadVideoById(response.videoId);
            }
          })
        }
      })

    }
  };
});

myApp.directive('youtubeControls', function () {
  return {
    restrict: 'A',
    templateUrl: 'modules/youtube/controls.html'
  };
});
