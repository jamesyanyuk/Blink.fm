(function () {
    'use strict';

    angular
        .module('searchBar')
        .directive('searchBar', searchBar);

    searchBar.$inject = [];

    /* @ngInject */
    function searchBar() {
        var directive = {
          restrict: 'E',
          templateUrl: 'modules/searchBar/searchBar.html'
        };
        return directive;
    }

})();
