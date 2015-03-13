(function () {
  angular
    .module('playingQueue')
    .controller('PlayingQueueCtrl', PlayingQueueCtrl);

  PlayingQueueCtrl.$inject = ['$rootScope', '$routeParams', '$scope', 'authSrv', 'playingQueueSrv'];

  /* @ngInject */
  function PlayingQueueCtrl($rootScope, $routeParams, $scope, authSrv, playingQueueSrv) {
    /* jshint validthis: true */
    var vm = this;
    vm.isBroadcaster = false;
    vm.playByIndex = playingQueueSrv.playByIndex;
    vm.queue = playingQueueSrv.getQueue();
    vm.removeByIndex = playingQueueSrv.removeByIndex;
    vm.sortableOptions = {
      // helper option to prevent Firefox automatically invoking the click event
      'helper': 'clone'
    };

    // Only show the queue to the broadcaster.
    authSrv.getCurrentUser(function (user) {
      if (user && user.username) {
        vm.isBroadcaster = (user.username === $routeParams.username);
      }
    });

    $scope.$watch(playingQueueSrv.getQueue, _onQueueChange, true);
    $rootScope.$on('/auth/logout', playingQueueSrv.discardAll);

    //////////////

    /*
     *  Listen to changes and update 'playingQueue' in sessionStorage, trigger event to resize youtube player.
     */
    function _onQueueChange(newQueue, oldQueue) {
      if (!newQueue) return;
      vm.queue = newQueue;
      if (newQueue.length > 0) {
        angular.element(".video-container").height("80%");
        angular.element(".video-container").trigger("resize");
      }
      else {
        angular.element(".video-container").height("100%");
        angular.element(".video-container").trigger("resize");
      }
    }
  }
}) ();
