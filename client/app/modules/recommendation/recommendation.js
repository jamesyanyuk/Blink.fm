/*
	Controller for recommendation
*/

var recommendation = angular.module('recommendation', []);

recommendation.controller('RecommendationCtrl', ['$scope', function ($scope) {
		
		$scope.recList = []

		$scope.$on('add_recommendation', function(event, data){
			$scope.recList.push(data);
		});

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