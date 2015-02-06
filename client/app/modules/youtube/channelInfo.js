(function () {
  'use strict';

  angular
    .module('YouTubeApp')
    .directive('channelInfo', channelInfo);

  channelInfo.$inject = [];

  /* @ngInject */
  function channelInfo() {

    var directive = {
      restrict: 'A',
      templateUrl: 'modules/youtube/channelInfo.html'
    };

    return directive;
  }
})();
