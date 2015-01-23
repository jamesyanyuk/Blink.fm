/*
	Service for recommendation
*/

angular.module('rec', [])
	.factory('recSrv', function ($scope) {
		$scope.recList = []
		$scope.add = function (video) {
			$scope.recList.push({
				"video": video,
				"likes": 1
			});
		};

		$scope.like = function (video) {
			for (var i = 0; i < $scope.recList.length; i++) {
				if ($scope.recList[i]['video'].id === video.id) {
					$scope.recList[i]['likes'] ++;
					break;
				}
			}
			$scope.recList.sort(function(a, b) {
				return -(a.likes - b.likes);
			});
		};
	}]);