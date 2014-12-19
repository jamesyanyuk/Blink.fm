var searchBar = angular.module('searchBar', []);

searchBar.constant('YOUTUBE_API', {
    'URL': 'https://www.googleapis.com/youtube/v3/search',
    'KEY': 'AIzaSyC_FcJlUP1Sv5niC5ItHOTkqwoC8mwKccU',
    'PART': 'id, snippet'
});

searchBar.controller('SearchBarCtrl', function ($scope, $http, YOUTUBE_API) {
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
                console.log("success ");
                console.log(data);
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