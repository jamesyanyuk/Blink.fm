var queue = angular.module('PlayingQueue', []);

queue
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


    function getRadioIdFromPath(path) {
      return path.substring(1);
    }
    //only show the queue to the broadcaster
    authSrv.getCurrentUser(function(user) {
      if (user && user.username) {
        $scope.isBroadcaster = (user.username === getRadioIdFromPath($location.path()));
      }
    });
    //get 'queue' item from sessionStorage when loading up the page
    if (sessionStorage.getItem('queue')) {
      $rootScope.playingQueue = JSON.parse(sessionStorage.getItem('queue'));
    }
    //update item 'queue' in sessionStorage
    $rootScope.$watch('playingQueue', function(newValue, oldValue) {
      sessionStorage.setItem('queue', JSON.stringify(newValue));
    }, true);

    function play(index) {
      var removedVideo = $scope.remove(index);
      $rootScope.player.loadVideoById(removedVideo.videoId);
    };
    function remove(index) {
      return $rootScope.playingQueue.splice(index, 1)[0];
    };
}])
.directive('playingQueue', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/playingQueue/playingQueue.html'
  };
});
