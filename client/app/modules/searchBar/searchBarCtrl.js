angular.module('searchBar', ['YouTubeApp', 'auth'])
  .constant('YOUTUBE_API', {
    'URL': 'https://www.googleapis.com/youtube/v3/search',
    'KEY': 'AIzaSyC_FcJlUP1Sv5niC5ItHOTkqwoC8mwKccU',
    'PART': 'id,snippet',
    'MAX_RESULTS': 5
  })
  .constant('KEYS', {
    'ARROW_UP': 38,
    'ARROW_DOWN': 40,
    'ENTER': 13
  })
  .controller('SearchBarCtrl', function ($scope, $rootScope, $http, authSrv, YOUTUBE_API, KEYS) {
    $scope.searchResults = [];
    // -1 is the default value
    $scope.searchFocusIndex = -1;
    $scope.showSearchResults = false;

    $scope.search = search;
    $scope.play = play;

    $scope.onFocus = function () {
      $scope.searchFocusIndex = -1;
      if ($scope.searchResults.length > 0)
        $scope.showSearchResults = true;
    };

    $scope.onBlur = function () {
      $scope.showSearchResults = false;
    };

    $scope.onInputUpdated = function () {
      var query = $scope.keywords;
      if (query.length > 5)
        $scope.search(query);
    };

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
    };

    function search(keywords) {
      if (keywords.length > 0) {
        $http.get(YOUTUBE_API.URL, {
          params: {
            'part': YOUTUBE_API.PART,
            'key': YOUTUBE_API.KEY,
            'q': keywords,
            'order': 'relevance',
            'maxResults': YOUTUBE_API.MAX_RESULTS
          }
        }).success( function(data) {
          _searchSuccess(data, keywords)
        });
      }
    }

    function play(video) {
      $scope.showSearchResults = false;
      $scope.searchResults = [];
      $scope.keywords = '';

      if (video && video.videoId) {
        $http.get('recommendation-engine/add-video/' + video.videoId).success(function () {
          $http.get('recommendation-engine/next').success(function(response){
            _addVideoSuccess(response, video);
          });
        });
      }
    }

    function _searchSuccess(keywords){

    }
    function _searchSuccess(data, keywords) {
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
    }

    function _addVideoSuccess(response, video) {
      if (response && response.videoId)
        authSrv.getCurrentUser(function (res) {
          if (res.username) {
            $rootScope.player.loadVideoById(response.videoId);
          } else {
            socket.emit('recommendation:addVideo', video);
          }
        });
    }

  });
