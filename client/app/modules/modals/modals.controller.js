(function () {
  'use strict';

  angular
    .module('modals')
    .controller('WaitListModalCtrl', WaitListModalCtrl);

  WaitListModalCtrl.$inject = ['$firebase', '$scope', '$modalInstance', 'gAnalytics', 'md5'];

  /* @ngInject */
  function WaitListModalCtrl($firebase, $scope, $modalInstance, gAnalytics, md5) {
    /* jshint validthis: true */
    var ref = new Firebase("https://blinkfm.firebaseio.com/waitlist");
    var sync = $firebase(ref);

    $scope.email = "";
    $scope.formSubmitted = false;
    $scope.submit = submit;

    $scope.close = function () {
      $modalInstance.close();
    };

    $scope.onFBLinkClick = function () {
      gAnalytics.eventTrack('user-acquisition', 'click-fb-group-link');
    };

    ////////////////
    function submit() {
      if ($scope.waitlistForm.email.$valid) {
        sync.$set(md5.createHash($scope.email), $scope.email);
        $scope.formSubmitted = true;
      }
    }
  }
})();
