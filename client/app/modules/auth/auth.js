/**
 * Created by tungpham31 on 1/11/15.
 *
 * Authentication service, which is in charge of user actions such as login, logout, get current user, etc.
 */

var auth = angular.module('auth', []);

auth.constant('loginMethods', {
  local: 0,
  fb: 1
});

auth.factory('authSrv', ['$q', '$http', '$location', '$rootScope', '$window', 'loginMethods',
  function ($q, $http, $location, $rootScope, $window, loginMethods) {
    return {
      /*
       Login the given user. The argument user should be in the form {'username' : 'jane', 'password' : 'doe'}.
       */
      login: function (loginMethod, user) {
        var deferred = $q.defer();

        if (loginMethod === loginMethods.local) {
          $http.post('/auth/login', user)
            .success(function (data) {
              if (data.user && data.user.username) {
                deferred.resolve({'user': data.user});
                $rootScope.$broadcast('/auth/login'); // broadcast to all scopes user login event.
              } else {
                deferred.reject({'message': 'The returned user object is empty.'});
              }
            })
            .error(function (data) {
              deferred.reject({'message': 'Login fails in server.'});
            }
          );
        } else if (loginMethod === loginMethods.fb) {
          $window.location =
            $window.location.protocol + '//' + $window.location.host + $window.location.pathname + 'auth/facebook';
        }

        return deferred.promise;
      },

      /*
       Log the current user out.
       */
      logout: function () {
        var deferred = $q.defer();

        $http.get('/auth/logout')
          .success(function (data) {
            sessionStorage.clear();
            $rootScope.$broadcast('/auth/logout'); // broadcast to all scopes user logout event.
            $location.path('/');
            deferred.resolve(data);
          })
          .error(function (data) {
            deferred.reject(data);
          }
        );

        return deferred.promise;
      },

      /*
       Arg: a callback function. The user object will be returned to the callback with the following form:
       {username: 'joe', 'password': 'jane'}.
       */
      getCurrentUser: function (cb) {
        if (!_hasCurrentUser()) {
          $http.get('/api/user')
            .success(function (data) {
              sessionStorage.setItem('currentUser', JSON.stringify(data));
              cb(data);
            });
        } else {
          cb(JSON.parse(sessionStorage.getItem("currentUser")));
        }
      }
    }
  }]);

/**
 * Private helper methods.
 */

/*
 Return true if there is a current user object stored in the session storage. Otherwise, return false.
 */
function _hasCurrentUser() {
  if (!sessionStorage.getItem("currentUser"))
    return false;
  var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.username)
    return false;
  return true;
}
