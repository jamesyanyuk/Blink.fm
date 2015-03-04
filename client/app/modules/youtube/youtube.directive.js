/**
 * Created by tungpham31 on 2/10/15.
 */

(function () {
  'use strict';

  angular
    .module('youtube')
    .directive('youtube', youtube);

  youtube.$inject = ['$http', '$rootScope', '$window', 'authSrv', 'youtubeSrv', 'YT_event'];

  /* @ngInject */
  function youtube($http, $rootScope, $window, authSrv, youtubeSrv, YT_event) {
    var directive = {
      restrict: 'E',
      template: '<div></div>',
      link: link
    };

    function link(scope, element, attrs) {
      scope.isPlayerReady = false;

      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      $window.onYouTubeIframeAPIReady = function () {
        youtubeSrv.onYouTubeIframeAPIReady(scope, element);
      };

      angular.element(".video-container").bind('resize', youtubeSrv.resizePlayer);

      angular.element($window).bind('resize', youtubeSrv.resizePlayer);

      var currentUser = null;
      authSrv.getCurrentUser(function (user) {
        currentUser = user;
      });

      var lastVideoId = null;
      scope.$on(YT_event.STATUS_CHANGE, function (event, message) {
        var videoData = $rootScope.player.getVideoData();
        var videoId = videoData ? videoData.video_id : null;

        if (videoId && videoId !== lastVideoId && videoData.title && currentUser) {
          $http.post("/api/broadcast-song-to-fb", {
            song: {
              video_id: videoId,
              title: videoData.title
            },
            user: currentUser
          })
        }

        if (message === "ENDED") {
          if ($rootScope.playingQueue.length > 0) {
            var nextVideo = $rootScope.playingQueue.shift();
            $rootScope.player.loadVideoById(nextVideo.videoId);
          }
          else {
            $http.get('recommendation-engine/next').success(function (response) {
              if (response && response.videoId) {
                $rootScope.player.loadVideoById(response.videoId);
              }
            })
          }
        }
      })

    }

    return directive;
  }

})
();
