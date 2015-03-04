(function () {
  'use strict';

  angular
    .module('youtube')
    .factory('youtubeSrv', youtubeSrv);

  youtubeSrv.$inject = ['$rootScope', 'YT_event'];

  /* @ngInject */
  function youtubeSrv($rootScope, YT_event) {
    var service = {
      resizePlayer: resizePlayer,
      onYouTubeIframeAPIReady: onYouTubeIframeAPIReady
    };

    return service;

    ////////////////

    /*
     Function to grab the current size of .video-container and set size of youtube player accordingly.
     */
    function resizePlayer() {
      var width = angular.element(".video-container").width();
      var height = angular.element(".video-container").height();
      if ($rootScope.player) {
        $rootScope.player.setSize(width, height);
      }
    }

    function onYouTubeIframeAPIReady(scope, element) {
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
          'onReady': function (event) {
            scope.isPlayerReady = true;
          },

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
                console.log("In ended");
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

      /* Resize player right after creation if a queue is loaded from sessionStorage,
       has to be put here to make sure both $rootScope.player and $rootScope.playingQueue have been created
       */
      resizePlayer();
    };
  }
})
();
