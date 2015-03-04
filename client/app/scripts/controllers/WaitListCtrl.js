(function () {
  'use strict';

  angular
    .module('apollonApp')
    .controller('WaitListCtrl', WaitListCtrl);

  WaitListCtrl.$inject = ['$firebase', '$scope', 'md5'];

  /* @ngInject */
  function WaitListCtrl($firebase, $scope, md5) {
    /* jshint validthis: true */
    var ref = new Firebase("https://blinkfm.firebaseio.com/waitlist");
    var sync = $firebase(ref);

    $scope.email = "";
    $scope.formSubmitted = false;
    $scope.submit = submit;
    $scope.close = close;

    ////////////////
    function submit() {
      if ($scope.waitlistForm.email.$valid) {
        sync.$set(md5.createHash($scope.email), $scope.email);
        $scope.formSubmitted = true;
      }
    }

    function close(){
      $scope.formSubmitted = false;
    }
  }
})();
