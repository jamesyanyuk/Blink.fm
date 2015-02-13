(function () {
  'use strict';

  angular
    .module('apollonApp')
    .constant('gatekeeper', {
      USE_TEST_FEATURE: true
    });
})();
