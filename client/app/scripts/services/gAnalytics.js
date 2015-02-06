'use strict';

/**
 * Created by tungpham31 on 1/29/15.
 */

angular.module('apollonApp')
  .factory('gAnalytics', ['$analytics', '$interval', '$rootScope', function ($analytics, $interval, $rootScope) {
    return {
      /*
       Constantly broadcast event to keep the session alive on GA.
       */
      trackPage: function (pageUrl) {
        $analytics.pageTrack(pageUrl);
        $interval(function () {
          if ($rootScope.player && $rootScope.player.getPlayerState() === 1){
            $analytics.eventTrack('user_live', {category: 'test', label: 'test'});
          }
        }, 30000);
      }
    };
  }]);
