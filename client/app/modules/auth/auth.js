/**
 * Created by tungpham31 on 1/11/15.
 *
 * Authentication service, which is in charge of user actions such as login, logout, get current user, etc.
 */

angular.module('auth', [])
  .factory('authSrv', function ($q, $http) {

    return {
      getCurrentUser: function(cb) {
        if (!this.hasCurrentUser()){
          $http.get('/api/user')
            .success(function(data) {
              sessionStorage.setItem('currentUser', JSON.stringify(data));
              cb(data);
            });
        } else {
          cb(JSON.parse(sessionStorage.getItem("currentUser")));
        }
      },

      hasCurrentUser: function() {
        if (!sessionStorage.getItem("currentUser")){
          $http.get()
        }
        return false;

        var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
        if (!currentUser || !currentUser.username) return false;

        return true;
      }
    }
  });
