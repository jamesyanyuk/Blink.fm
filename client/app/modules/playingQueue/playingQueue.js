var queue = angular.module('PlayingQueue', []);

queue
.controller('QueueCtrl', ['$rootScope', '$scope', '$location', 'authSrv',
  function($rootScope, $scope, $location, authSrv) {
  $scope.isBroadcaster = false;
  $rootScope.playingQueue = [];
  if (sessionStorage.getItem('queue')) {
    $rootScope.playingQueue = JSON.parse(sessionStorage.getItem('queue'));
  }
  $rootScope.$watch('playingQueue', function(newValue, oldValue) {
    sessionStorage.setItem('queue', JSON.stringify(newValue));
  }, true);

  function getRadioIdFromPath(path) {
    return path.substring(1);
  }
  authSrv.getCurrentUser(function(user) {
    if (user && user.username) {
      $scope.isBroadcaster = (user.username === getRadioIdFromPath($location.path()));
    }
  });
  $scope.dragStart = function(index) {
    $rootScope.playingQueue.splice(index,1);
  };
  $scope.dragEnd = function(index, item) {
    $rootScope.playingQueue.splice(index, 0, item);
  };
  $scope.play = function(index) {
    var removedVideo = $rootScope.playingQueue.splice(index, 1)[0];
    $rootScope.player.loadVideoById(removedVideo.videoId);
  }
}])
.directive('playingQueue', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/playingQueue/playingQueue.html'
  };
});