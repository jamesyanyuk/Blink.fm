(function () {
  'use strict';

  angular
    .module('youtube')
    .directive('channelInfo', channelInfo);

  channelInfo.$inject = [];

  /* @ngInject */
  function channelInfo() {

    var directive = {
      restrict: 'A',
      templateUrl: 'modules/youtube/channel_info.html'
    };

    return directive;
  }
})();
