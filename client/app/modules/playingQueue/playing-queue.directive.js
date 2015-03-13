(function () {
  angular.module('playingQueue')
    .directive('playingQueue', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/playingQueue/playingQueue.html'
      };
    });
}) ();
