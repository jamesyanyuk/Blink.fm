'use strict';

/**
 * Created by tungpham31 on 1/29/15.
 */

angular.module('apollonApp')
  .factory('gAnalytics', ['$analytics', '$interval', '$rootScope', function ($analytics, $interval, $rootScope) {
    return {
      eventTrack: function (eventCategory, eventAction) {
        $analytics.eventTrack(eventAction, {category: eventCategory});
      },

      /*
       Constantly broadcast event to keep the session alive on GA.
       */
      keepSessionAlive: function () {
        $interval(function () {
          if ($rootScope.player && $rootScope.player.getPlayerState() === 1) {
            this.eventTrack('keep_user_live', 'fire_action');
          }
        }.bind(this), 30000);
      }
    };
  }]);
