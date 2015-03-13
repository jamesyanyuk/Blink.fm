(function() {
  angular.module('playingQueue', [])
    .constant('PLAYER_STATUS', {
      UNSTARTED: -1,
      ENDED: 0,
      PLAYING: 1,
      PAUSED: 2,
      BUFFERING: 3,
      VIDEO_CUED: 5
    });
}) ();
