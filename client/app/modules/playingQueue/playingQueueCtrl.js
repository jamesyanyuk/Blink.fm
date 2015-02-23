angular.module('playingQueue', [])
.controller('QueueCtrl', ['$location', '$rootScope', '$scope', 'authSrv',
  function($location, $rootScope, $scope, authSrv) {
    $scope.isBroadcaster = false;
    $rootScope.playingQueue = [];
    $scope.play = play;
    $scope.remove = remove;
    $scope.sortableOptions = {
      // helper option to prevent Firefox automatically invoking the click event
      'helper': 'clone'
    };

    // Only show the queue to the broadcaster.
    authSrv.getCurrentUser(function(user) {
      if (user && user.username) {
        $scope.isBroadcaster = (user.username === _getRadioIdFromPath($location.path()));
      }
    });

    // Load 'queue' item from sessionStorage when loading up the page.
    if (sessionStorage.getItem('playingQueue')) {
      $rootScope.playingQueue = JSON.parse(sessionStorage.getItem('playingQueue'));
    }

    $rootScope.$watch('playingQueue', onQueueChange, true);

    // Listen for the logout event, in which case we remove the queue from storage.
    $rootScope.$on('/auth/logout', function() {
      sessionStorage.removeItem('playingQueue');
    });

    //////////////

    function _getRadioIdFromPath(path) {
      return path.substring(1);
    }

    function play(index) {
      var removedVideo = $scope.remove(index);
      $rootScope.player.loadVideoById(removedVideo.videoId);
    }

    function remove(index) {
      return $rootScope.playingQueue.splice(index, 1)[0];
    }

    /*
     *  Listen to changes and update 'playingQueue' in sessionStorage, trigger event to resize youtube player.
     */
    function onQueueChange(newQueue, oldQueue) {
      sessionStorage.setItem('playingQueue', JSON.stringify(newQueue));
      if (newQueue.length > 0) {
        angular.element(".video-container").height("80%");
        angular.element(".video-container").trigger("resize");
      }
      else {
        angular.element(".video-container").height("100%");
        angular.element(".video-container").trigger("resize");
      }
    }
}]);
