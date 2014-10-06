(function (angular) {
  'use strict';
  angular.module('oauth.google.jsClient', ['ui.router', 'oauth.google.config'])

  // register a route that listens for the google oauth2 callback
  .config(function ($stateProvider) {
    $stateProvider.state('oauth_callback', {
      url: '/access_token=:accessToken',
      controller: 'TokenCallbackController'
    });
  })

  .controller('TokenCallbackController', ['$window', '$location', function($window, $location) {
    var processTokenCallback = function() {
      var params = {}, queryString = $location.path().substring(1),
          regex = /([^&=]+)=([^&]*)/g, m;
      while ((m = regex.exec(queryString)) !== null) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      var $opener = $window.opener.angular.element($window.opener);
      $opener.triggerHandler('oauthcallback', params);
      $window.close();
    };

    processTokenCallback();
  }])

  .factory('googleTokenPromiseJs', function($q) {
    var getTokenPromise = function(authWindow) {
      var deferred = $q.defer();
      angular.element(authWindow.opener).on('oauthcallback', function(event, data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    return getTokenPromise;
  })

  ;
})(angular);
