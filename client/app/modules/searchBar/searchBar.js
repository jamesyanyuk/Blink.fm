var searchBar = angular.module('searchBar', ['YouTubeApp']);

searchBar.constant('YOUTUBE_API', {
  'URL': 'https://www.googleapis.com/youtube/v3/search',
  'KEY': 'AIzaSyC_FcJlUP1Sv5niC5ItHOTkqwoC8mwKccU',
  'PART': 'id,snippet'
});

searchBar.controller('SearchBarCtrl', function ($scope, $rootScope, $http, YOUTUBE_API) {
  $scope.searchResults = [];
  $scope.showSearchResults = false;
  $scope.noResultsFound = false;

  $scope.onFocus = function () {
    if ($scope.searchResults.length > 0)
      $scope.showSearchResults = true;
  }

  $scope.onBlur = function () {
    $scope.showSearchResults = false;
  }

  $scope.onInputUpdated = function () {
    var query = $scope.keywords;
    if (query.length > 5 && query.length % 2 === 0)
      $scope.search(query);
  }

  $scope.search = function (keywords) {
    var maxResults = 5;

    if (keywords.length > 0) {
      $http.get(YOUTUBE_API.URL, {
        params: {
          'part': YOUTUBE_API.PART,
          'key': YOUTUBE_API.KEY,
          'q': keywords,
          'order': 'relevance',
          'maxResults': maxResults
        }
      }).
        success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available

          var keywordLen = $scope.keywords.length;
          if (keywords === $scope.keywords.substr(0, keywordLen - (keywordLen % 2))) {
            $scope.searchResults = [];

            for (i = 0; i < data.items.length; i++) {
              $scope.searchResults.push({
                videoId: data.items[i].id.videoId,
                title: function () {
                  var cutoffLen = 50;
                  var title = data.items[i].snippet.title;

                  if (title.length > cutoffLen)
                    title = title.substr(0, cutoffLen - 3) + '...';

                  return title;
                }(),
                thumbnail: data.items[i].snippet.thumbnails.default.url
              });
            }

            if ($scope.searchResults.length > 0)
              $scope.showSearchResults = true;
            else
              $scope.noResultsFound = true;
          }
        }).
        error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("Fail to retrieve list of videos from Youtube!");
          console.log(data);
        });
    }
  }

  $scope.play = function (videoId) {
    $scope.showSearchResults = false;

    if (videoId) {
      $http.get('recommendation-engine/add-video/' + videoId).success(function () {
        $http.get('recommendation-engine/next').success(function (response) {
          if (response && response.videoId) {
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
