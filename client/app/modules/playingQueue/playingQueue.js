var queue = angular.module('PlayingQueue', []);

queue
.controller('QueueCtrl', ['$scope', '$location', 'authSrv', function($scope, $location, authSrv) {
  $scope.isBroadcaster = false;
  $scope.videoList =  [];
  
  function getRadioIdFromPath(path) {
    return path.substring(1);
  }
  authSrv.getCurrentUser(function(user) {
    if (user && user.username) {
      $scope.isBroadcaster = (user.username === getRadioIdFromPath($location.path()));
    }
  });
  
}])
.directive('playingQueue', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/playingQueue/playingQueue.html'
  };
});