/**
 * Created by tungpham31 on 2/10/15.
 */

(function () {
  'use strict';

  angular
    .module('youtube')
    .constant('YT_event', {
      STOP: 0,
      PLAY: 1,
      PAUSE: 2,
      STATUS_CHANGE: 3
    });
})();
