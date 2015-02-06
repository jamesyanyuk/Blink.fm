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
                _cacheUser(data.user);
                $rootScope.$broadcast('/auth/login'); // broadcast to all scopes user login event.
                deferred.resolve({'user': data.user});
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
            sessionStorage.removeItem('currentUser');
            $rootScope.$broadcast('/auth/logout'); // broadcast to all scopes user logout event.
            $location.url('/');
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
            .success(function (user) {
              _cacheUser(user);
              cb(user);
            });
        } else {
          cb(JSON.parse(sessionStorage.getItem("currentUser")));
        }
      },

      /*
       Return the user's nickname in session storage. If not exist, get current user to get username. If none exists,
       return null.
       */
      getNickname: function (nicknameSrv) {
        var deferred = $q.defer();

        // If nickname in cache, return right away.
        if (sessionStorage.getItem('nickname')) {
          deferred.resolve(sessionStorage.getItem('nickname'));
          return deferred.promise;
        }

        this.getCurrentUser(function (currentUser) {
          // If a user exists, return the username as nickname.
          if (currentUser && currentUser.username) {
            deferred.resolve(currentUser.username);
            return deferred.promise;
          }

          // Otherwise, open nickname modal to ask user to enter their nickname.
          nicknameSrv.openNicknameModal().then(
            function (nickname) {
              _cacheNickname(nickname);
              deferred.resolve(nickname);
            },
            function (error) {
              deferred.reject(error);
            }
          );
        });

        return deferred.promise;
      },

      /*
       Check authentication of the current user. Redirect the user to appropriate view depending on his authentication.
       For example, if the user is logged in and in Login view, he will be redirected to Main view. If he is in a view
       that requires login but he isn't, he will be redirected to Login view.
       Right now: this method should only be used in LoginCtrl.
       */
      checkAuth: function () {
        this.getCurrentUser(function (currentUser) {
          if (currentUser && currentUser.username) {
            $location.url(currentUser.username);
          }
        });
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

/*
 Add the given user to session storage.
 */
function _cacheUser(user) {
  if (user && user.username) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('nickname', user.username);
  }
}

/*
 Add user's nickname to session storage.
 */
function _cacheNickname(nickname) {
  if (nickname) {
    sessionStorage.setItem('nickname', nickname);
  }
}
