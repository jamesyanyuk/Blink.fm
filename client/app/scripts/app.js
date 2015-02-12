'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('apollonApp', [
    'auth',
    'angulartics',
    'angulartics.google.analytics',
    'firebase',
    'modals',
    'navBar',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'playingQueue',
    'YouTubeApp',
    'chat',
    'searchBar',
    'recommendation',
    'ui.bootstrap',
    'ui.sortable',
    'btford.socket-io',
    'luegg.directives'
  ])
  .config(function ($analyticsProvider, $routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/:username', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);

    // Turn off automatic tracking.
    $analyticsProvider.virtualPageviews(false);
  })
  .factory('socket', function(socketFactory) {
    return socketFactory();
  });
