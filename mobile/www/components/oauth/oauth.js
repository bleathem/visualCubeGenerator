(function (angular) {
  'use strict';
  angular.module('oauth', ['ui.router'])

  .config(function ($stateProvider) {
    $stateProvider.state('oauth_callback', {
      url: '/oauth/callback?user&error',
      controller: 'TokenCallbackController'
    });
  })

  .controller('TokenCallbackController', ['$window', '$stateParams', function($window, $stateParams) {
    var $opener = $window.opener.angular.element($window.opener);
    $opener.triggerHandler('oauthcallback', $stateParams);
  }])

  .run(function(auth) {
    auth.readUser();
  })

  .factory('auth', function($localStorage) {
    var user;

    var readUser = function() {
      var json = $localStorage.getItem('user');
      if (json) {
        user = JSON.parse(json);
      }
      return user;
    };

    var setUser = function(setUser) {
      user = setUser;
      $localStorage.setItem('user', JSON.stringify(user));
    };

    var logout = function() {
      user = null;
      $localStorage.removeItem('user');
    };

    return {
      setUser: setUser,
      logout: logout,
      readUser: readUser,
      getUser: function() {
        return user;
      }
    };
  })
})(angular);
