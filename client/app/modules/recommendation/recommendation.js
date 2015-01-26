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

	$scope.like = function(videoid) {
		socket.emit('like_recommendation_video', {
			videoid: videoid
		});
	};

	$scope.play = function(videoid){
		$rootScope.player.loadVideoById(videoid);
		socket.emit('remove_recommendation_video', {
			videoid: videoid
		});
	};
}]);