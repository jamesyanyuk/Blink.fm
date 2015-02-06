(function () {
  'use strict';

  angular
    .module('recommendation')
    .directive('recommendation', recommendation);

  recommendationDrt.$inject = [];

  /* @ngInject */
  function recommendation() {

    var directive = {
      restrict: 'E',
      templateUrl: 'modules/recommendation/recommendation.html'
    };
    return directive;

  }
})();
