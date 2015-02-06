/**
 * Created by tungpham31 on 2/3/15.
 */

angular.module('modals', [])
  .controller('WaitListModalCtrl', function ($scope, $modalInstance) {
    $scope.close = function () {
      $modalInstance.close();
    }
  });
