angular.module('playingQueue', [])
.controller('QueueCtrl', ['$rootScope', '$scope', '$location', 'authSrv',
  function($rootScope, $scope, $location, authSrv) {
    $scope.isBroadcaster = false;
    $rootScope.playingQueue = [];
    $scope.play = play;
    $scope.remove = remove;
    $scope.thumbnailStyle = {
      position: 'relative',
      'background-color': 'transparent',
      display: 'inline-block',
      border: 'none',
      width: '25%',
      'vertical-align': 'top'
    };
    $scope.closeIconStyle = {
      position:'absolute',
      top:0,
      right:0
    };
    $scope.sortableOptions = {
      // helper option to prevent Firefox automatically invoking the click event
      'helper': 'clone'
    };


    function getRadioIdFromPath(path) {
      return path.substring(1);
    }
    // only show the queue to the broadcaster
    authSrv.getCurrentUser(function(user) {
      if (user && user.username) {
        $scope.isBroadcaster = (user.username === getRadioIdFromPath($location.path()));
      }
    });
    // get 'queue' item from sessionStorage when loading up the page
    if (sessionStorage.getItem('playingQueue')) {
      $rootScope.playingQueue = JSON.parse(sessionStorage.getItem('playingQueue'));
    }
    // update item 'playingQueue' in sessionStorage
    $rootScope.$watch('playingQueue', function(newValue, oldValue) {
      sessionStorage.setItem('playingQueue', JSON.stringify(newValue));
    }, true);
    // listen for the logout event, in which case we remove the queue from storage
    $rootScope.$on('/auth/logout', function() {
      sessionStorage.removeItem('playingQueue');
    });
    function play(index) {
      var removedVideo = $scope.remove(index);
      $rootScope.player.loadVideoById(removedVideo.videoId);
    };
    function remove(index) {
      return $rootScope.playingQueue.splice(index, 1)[0];
    };
}]);
