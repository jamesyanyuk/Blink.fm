var searchBar = angular.module('searchBar', ['YouTubeApp', 'auth']);

searchBar.constant('YOUTUBE_API', {
  'URL': 'https://www.googleapis.com/youtube/v3/search',
  'KEY': 'AIzaSyC_FcJlUP1Sv5niC5ItHOTkqwoC8mwKccU',
  'PART': 'id,snippet'
});

searchBar.controller('SearchBarCtrl', function ($scope, $rootScope, $http, YOUTUBE_API, authSrv, socket) {
  $scope.search = function () {
    $http.get(YOUTUBE_API.URL, {
      params: {
        'part': YOUTUBE_API.PART,
        'key': YOUTUBE_API.KEY,
        'q': $scope.keywords
      }
    }).
      success(function (data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        var videoId = data.items[0].id.videoId;
        if (videoId) {
          $http.get('recommendation-engine/add-video/' + videoId).success(function () {
            $http.get('recommendation-engine/next').success(function (response) {
              if (response && response.videoId) {
                authSrv.getCurrentUser(function(res){
                  if (res.username){
                    $rootScope.player.loadVideoById(response.videoId);
                  } else {
                    socket.emit('add_recommendation_video', {
                        id: videoId,
                        title: data.items[0].snippet.title,
                        thumbnail: data.items[0].snippet.thumbnails.default.url,
                    });
                  }
                });
              }
            })
          });
        }
      }).
      error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("Fail to retrieve list of videos from Youtube!");
        console.log(data);
      });
  }
});

searchBar.directive('searchBar', function () {
  return {
    restrict: "E",
    templateUrl: 'modules/searchBar/searchBar.html'
  };
});
