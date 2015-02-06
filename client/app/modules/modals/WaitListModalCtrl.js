/**
 * Created by tungpham31 on 2/3/15.
 */

angular.module('modals', [])
  .controller('WaitListModalCtrl', function ($scope, $modalInstance, gAnalytics) {
    $scope.close = function () {
      $modalInstance.close();
    };

    $scope.onFBLinkClick = function () {
      gAnalytics.eventTrack('user-acquisition', 'click-fb-group-link');
    };
  });
