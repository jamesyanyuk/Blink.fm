var myApp = angular.module('YouTubeApp', []);

myApp.constant('YT_event', {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
  STATUS_CHANGE: 3
});

myApp.controller('YouTubeCtrl', function ($scope, YT_event) {
  //initial settings
  $scope.yt = {
    width: 600,
    height: 480,
    videoid: "KRaWnd3LJfs",
    playerStatus: "NOT PLAYING"
  };

  $scope.YT_event = YT_event;

  $scope.sendControlEvent = function (ctrlEvent) {
    this.$broadcast(ctrlEvent);
  }

  $scope.$on(YT_event.STATUS_CHANGE, function (event, data) {
    $scope.yt.playerStatus = data;
  });
});

myApp.directive('youtube', function ($window, YT_event, $rootScope, $http, youtubeSrv) {
  return {
    restrict: "E",

    template: '<div></div>',

    link: function (scope, element, attrs) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      $window.onYouTubeIframeAPIReady = function () {
        $rootScope.player = new YT.Player(element.children()[0], {
          playerVars: {
            autoplay: 1,
            html5: 1,
            theme: "light",
            modesbranding: 0,
            color: "white",
            iv_load_policy: 3,
            showinfo: 1,
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
              youtubeSrv.cueVideo(response.videoId);
            }
          })
        }
      })

    }
  };
});