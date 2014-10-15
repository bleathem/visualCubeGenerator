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

  .factory('auth', function($localStorage) {
    var cachedUser;

    var readUser = function() {
      var json = $localStorage.getItem('user');
      if (json) {
        cachedUser = JSON.parse(json);
      }
      return cachedUser;
    };

    var setUser = function(user) {
      cachedUser = user;
      $localStorage.setItem('user', JSON.stringify(user));
    };

    var logout = function() {
      cachedUser = null;
      $localStorage.removeItem('user');
    };

    readUser();

    return {
      setUser: setUser,
      logout: logout,
      readUser: readUser,
      user: cachedUser
    };
  })
})(angular);
