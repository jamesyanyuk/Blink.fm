/**
 * Created by tungpham31 on 1/11/15.
 *
 * Authentication service, which is in charge of user actions such as login, logout, get current user, etc.
 *
 * Currently, when a user logs in, the service will check if there is such a user existing in its hard-coded
 * user database. It's a terrible practice! I know, I'm ashamed of myself too.
 */

angular.module('apollonApp')
  .factory('authSrv', function ($q) {
    HARDCODED_USERS = [
      {'username': 'tungpham31', 'password': 'tung'},
      {'username': 'james', 'password': 'james'}
    ];

    return {
      login: function (user) {
        var deferred = $q.defer();
        /* Comment this out for the current MVP version.
         $http.post('/auth/login', user)
         .success(function (data) {
         deferred.resolve(data);
         })
         .error(function (data) {
         deferred.reject(data);
         });*/

        for (i = 0; i < HARDCODED_USERS.length; i++) {
          if (HARDCODED_USERS[i].username === user.username && HARDCODED_USERS[i].password === user.password) {
            deferred.resolve();
            return deferred.promise;
          }
        }

        deferred.reject();
        return deferred.promise;
      }
    }
  });
