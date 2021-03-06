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
    auth.readCategory();
  })

  .factory('auth', function($localStorage) {
    var auth = {
      user: null,
      category: null
    };

    auth.readUser = function() {
      var json = $localStorage.getItem('user');
      if (json) {
        this.user = angular.fromJson(json);
      }
      return this.user;
    };

    auth.setUser = function(setUser) {
      this.user = setUser;
      $localStorage.setItem('user', angular.toJson(this.user));
      return this.user;
    };

    auth.logout = function() {
      this.user = null;
      this.category = null;
      $localStorage.removeItem('user');
      return this.user;
    };

    auth.readCategory = function() {
      var json = $localStorage.getItem('category');
      if (json) {
        this.category = angular.fromJson(json);
      }
      return this.category;
    };

    auth.setCategory = function(setCategory) {
      this.category = setCategory;
      $localStorage.setItem('category', angular.toJson(this.category));
      return this.category;
    };

    return auth;
  });
})(angular);
