/**
 * Created by tungpham31 on 12/21/14.
 */
'use strict'

angular.module('YouTubeApp')
  .factory('youtubeSrv', function ($rootScope) {
    return {
      cueVideo: function (videoId) {
        $rootScope.player.cueVideoById(videoId);
      }
    }
  });
