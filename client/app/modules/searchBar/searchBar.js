var searchBar = angular.module('searchBar', ['YouTubeApp']);

searchBar.constant('YOUTUBE_API', {
  'URL': 'https://www.googleapis.com/youtube/v3/search',
  'KEY': 'AIzaSyC_FcJlUP1Sv5niC5ItHOTkqwoC8mwKccU',
  'PART': 'id,snippet',
  'MAX_RESULTS': 5

});

searchBar.constant('KEYS', {
  'ARROW_UP': 38,
  'ARROW_DOWN': 40,
  'ENTER': 13
});

searchBar.controller('SearchBarCtrl', function ($scope, $rootScope, $http, YOUTUBE_API, KEYS) {
  $scope.searchResults = [];
  $scope.searchFocusIndex = null;
  $scope.showSearchResults = false;

  $scope.onFocus = function () {
    // -1 is the default value
    $scope.searchFocusIndex = -1;
    if ($scope.searchResults.length > 0)
      $scope.showSearchResults = true;
  }

  $scope.onBlur = function () {
    $scope.showSearchResults = false;
  }

  $scope.onInputUpdated = function () {
    var query = $scope.keywords;
    if (query.length > 5)
      $scope.search(query);
  }

  $scope.updateFocusIndex = function (event) {
    if ($scope.showSearchResults) {
      var index = $scope.searchFocusIndex;
      switch (event.keyCode) {
        case KEYS.ARROW_UP:
          if (index > -1)
            $scope.searchFocusIndex = (index + $scope.searchResults.length - 1) % $scope.searchResults.length;
          break;
        case KEYS.ARROW_DOWN:
          $scope.searchFocusIndex = (index + $scope.searchResults.length + 1) % $scope.searchResults.length;
          break;
        case KEYS.ENTER:
          if (index >= 0 && index < $scope.searchResults.length)
            $scope.play($scope.searchResults[index].videoId);
      }
    }
  }

  $scope.search = function (keywords) {
    if (keywords.length > 0) {
      $http.get(YOUTUBE_API.URL, {
        params: {
          'part': YOUTUBE_API.PART,
          'key': YOUTUBE_API.KEY,
          'q': keywords,
          'order': 'relevance',
          'maxResults': YOUTUBE_API.MAX_RESULTS
        }
      })
        .success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available

          if (keywords === $scope.keywords) {
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
          }
        })
        .error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log('Failed to retrieve list of videos from Youtube!');
          console.log(data);
        });
    }
  }

  $scope.play = function (videoId) {
    $scope.showSearchResults = false;
    $scope.searchResults = [];
    $scope.keywords = '';

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
    restrict: 'E',
    templateUrl: 'modules/searchBar/searchBar.html'
  };
});
