var searchBar = angular.module('searchBar', ['YouTubeApp']);

searchBar.constant('YOUTUBE_API', {
  'URL': 'https://www.googleapis.com/youtube/v3/search',
  'KEY': 'AIzaSyC_FcJlUP1Sv5niC5ItHOTkqwoC8mwKccU',
  'PART': 'id,snippet'
});

searchBar.controller('SearchBarCtrl', function ($scope, $rootScope, $http, YOUTUBE_API) {
  $scope.showSearchResults = false;

  $scope.search = function () {
    $scope.searchResults = [];

    $http.get(YOUTUBE_API.URL, {
      params: {
        'part': YOUTUBE_API.PART,
        'key': YOUTUBE_API.KEY,
        'q': $scope.keywords,
        'order': 'relevance',
        'maxResults': 5
      }
    }).
      success(function (data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available

        for (i = 0; i < data.items.length; i++) {
          $scope.searchResults.push({
            videoId: data.items[i].id.videoId,
            title: data.items[i].snippet.title
          });
        }

        $scope.showSearchResults = true;
      }).
      error(function (data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("Fail to retrieve list of videos from Youtube!");
        console.log(data);
      });
  }

  $scope.play = function (videoId) {
    $scope.showSearchResults = false;

    if (videoId) {
      $http.get('recommendation-engine/add-video/' + videoId).success(function () {
        $http.get('recommendation-engine/next').success(function (response) {
          if (response && response.videoId) {
            console.log('Test');
            $rootScope.player.loadVideoById(response.videoId);
          }
        })
      });
    }
  }
});

searchBar.directive('searchBar', function () {
  return {
    restrict: "E",
    templateUrl: 'modules/searchBar/searchBar.html'
  };
});
