'use strict';
(function (angular) {
  angular.module('oauth', ['ui.router', 'visualCubeGenerator.config'])

  .config(function ($stateProvider) {
    $stateProvider.state('oauth_callback', {
      url: '/oauth/callback?user&error',
      controller: 'TokenCallbackController'
    });
  })

  .controller('TokenCallbackController', function($window, $stateParams, appConfig) {
    if ($window.opener) {
      $window.opener.postMessage($stateParams, appConfig.frontend);
    }
  })

  .run(function(auth) {
    auth.readUser();
  })

  .factory('auth', function($localStorage) {
    var auth = {
      user: null
    };

    auth.readUser = function() {
      var json = $localStorage.getItem('user');
      if (json) {
        this.user = JSON.parse(json);
      }
      return this.user;
    };

    auth.setUser = function(setUser) {
      this.user = setUser;
      $localStorage.setItem('user', JSON.stringify(this.user));
      return this.user;
    };

    auth.logout = function() {
      this.user = null;
      $localStorage.removeItem('user');
      return this.user;
    };

    return auth;
  });
})(angular);
