/**
 * Created by tungpham31 on 2/3/15.
 */

angular.module('modals', [])
  .controller('WaitListModalCtrl', function ($firebase, $scope, $modalInstance, gAnalytics) {
    var ref = new Firebase("https://blinkfm.firebaseio.com/waitlist");
    var sync = $firebase(ref);

    $scope.email = "";
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
        sync.$set(hashCode($scope.email), $scope.email);
        $modalInstance.close();
      }
    };

    function hashCode(str) {
      var hash = 0;
      if (str.length == 0) return hash;
      for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }
  });
