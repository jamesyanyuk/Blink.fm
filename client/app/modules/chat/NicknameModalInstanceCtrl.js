/**
 * Created by tungpham31 on 1/27/15.
 */

angular.module('chat')
  .controller('NicknameModalInstanceCtrl', function ($scope, $modalInstance) {
    $scope.message = '';
    $scope.submit = function () {
      if ($scope.nickname) {
        $modalInstance.close($scope.nickname);
      } else {
        $scope.message = 'Nickname cannot be empty!'
      }
    };
  });
