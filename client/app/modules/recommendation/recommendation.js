/*
	Controller for recommendation
*/

var recommendation = angular.module('recommendation', []);

recommendation.controller('RecommendationCtrl', ['$scope', '$rootScope', 'socket', 'authSrv', function($scope, $rootScope, socket, authSrv) {

	$scope.recList = []

	$scope.hasCurrentUser = false;
	authSrv.getCurrentUser(function(currentUser) {
		if (currentUser && currentUser.username) {
			$scope.hasCurrentUser = true;
		}
	});

	socket.on('update_recommendation_list', function(data) {
		$scope.recList = data;
	});

	$scope.like = function(videoId) {
		socket.emit('like_recommendation_video', {
			id: videoId
		});
	};

	$scope.play = function(videoId){
		$rootScope.player.loadVideoById(videoId);
		socket.emit('remove_recommendation_video', {
			id: videoId
		});
	};
}]);