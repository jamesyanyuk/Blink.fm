var myApp = angular.module('searchBar', []);

myApp.controller('SearchBarCtrl', function ($scope) {
    $scope.search = function () {
    }
});

myApp.directive('searchBar', function () {
    return {
        restrict: "E",
        templateUrl: 'modules/searchBar/main.html'
    };
});