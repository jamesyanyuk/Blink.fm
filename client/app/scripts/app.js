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
    'navBar',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'PlayingQueue',
    'YouTubeApp',
    'chat',
    'searchBar',
    'ui.bootstrap',
    'ui.sortable',
    'btford.socket-io',
    'luegg.directives'
  ])
  .config(function ($routeProvider, $locationProvider) {
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
  })
  .factory('socket', function(socketFactory) {
    return socketFactory();
  });
