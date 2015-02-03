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
    $scope.draggedObject = {};
    $scope.dragStart = function(index) {
      $scope.draggedObject = $rootScope.playingQueue.splice(index, 1)[0];
      console.log('drag started');
    }
    $scope.move = function() {
      console.log('moved');
    }
    $scope.copy = function() {
      console.log('copied');
    }
    $scope.dragover = function() {
      console.log('dragged over');
    }
    $scope.drop = function(event, index, item, type) {
      $rootScope.playingQueue.splice(index, 0, item);
      console.log('dropped');
    }
    $scope.play = function(index) {
      var removedVideo = $rootScope.playingQueue.splice(index, 1)[0];
      $rootScope.player.loadVideoById(removedVideo.videoId);
    }
    $scope.remove = function(index) {
      $rootScope.playingQueue.splice(index, 1);
    }
}])
.directive('playingQueue', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/playingQueue/playingQueue.html'
  };
});
