/**
 * Created by tungpham31 on 1/27/15.
 */

angular.module('chat')
  .constant('constants', {
    NICKNAME_MAX_LENGTH: 15
  })
  .controller('NicknameModalInstanceCtrl', function ($scope, $modalInstance, constants) {
    $scope.message = '';
    $scope.submit = function () {
      if (!$scope.nickname) {
        $scope.message = 'Nickname cannot be empty!';
      }
      else if ($scope.nickname.length > constants.NICKNAME_MAX_LENGTH) {
        $scope.message = "Nickname cannot be over " + constants.NICKNAME_MAX_LENGTH + " characters.";
      } else {
        $modalInstance.close($scope.nickname);
      }
    };
  });
