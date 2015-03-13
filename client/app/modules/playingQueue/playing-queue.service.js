(function () {
  'use strict';

  angular
    .module('playingQueue')
    .factory('playingQueueSrv', playingQueueSrv);

  playingQueueSrv.$inject = ['$rootScope', 'PLAYER_STATUS'];

  /* @ngInject */
  function playingQueueSrv($rootScope, PLAYER_STATUS) {
    var queue = [];
    if (sessionStorage.getItem('playingQueue')) {
      var queueItem = sessionStorage.getItem('playingQueue');
      queue = JSON.parse(queueItem);
    }

    var service = {
      addSong: addSong,
      discardAll: discardAll,
      getQueue: getQueue,
      hasNext: hasNext,
      playByIndex: playByIndex,
      playNext: playNext,
      removeByIndex: removeByIndex
    };

    return service;

    ////////////////

    function addSong(video) {
      var playerStatus = $rootScope.player.getPlayerState();
      if ((playerStatus < PLAYER_STATUS.PLAYING || playerStatus > PLAYER_STATUS.BUFFERING) && queue.length == 0) {
        $rootScope.player.loadVideoById(video.videoId);
      }
      else {
        queue.push(video);
      }
      notifySessionStorage();
    }

    function discardAll() {
      queue = [];
      sessionStorage.removeItem('playingQueue');
    }

    function getQueue() {
      return queue;
    }

    function hasNext() {
      return queue.length > 0;
    }

    function notifySessionStorage() {
      sessionStorage.setItem('playingQueue', JSON.stringify(queue));
    }

    function playByIndex(index) {
      var removedVideo = removeByIndex(index);
      $rootScope.player.loadVideoById(removedVideo.videoId);
    }

    function playNext() {
      playByIndex(0);
    }

    function removeByIndex(index) {
      var songObject = queue.splice(index, 1)[0];
      notifySessionStorage();
      return songObject;
    }
  }
})();
