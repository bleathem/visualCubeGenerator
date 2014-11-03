'use strict';
var angular = require('angular');
require('angular-ui-router');

angular.module('oauth', ['ui.router'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('oauth_callback', {
    url: '/oauth/callback?user&error',
    controller: 'TokenCallbackController'
  });
}])

.controller('TokenCallbackController', ['$window', '$stateParams', function($window, $stateParams) {
  var $opener = $window.opener.angular.element($window.opener);
  $opener.triggerHandler('oauthcallback', $stateParams);
}])

.run(function(auth) {
  auth.readUser();
})

.factory('auth', ['$localStorage', function($localStorage) {
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
}]);
