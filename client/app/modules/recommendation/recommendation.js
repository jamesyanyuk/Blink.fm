/*
	Controller for recommendation
*/

var chat = angular.module('chat', []);

chat.controller('ChatCtrl', ['$scope',
	function ($scope) {
		
		$scope.recList = []

		$scope.like = function(video) {
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
	}
]);