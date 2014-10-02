(function (angular) {
  'use strict';
  angular.module('oauth.google.jsClient', ['ui.router', 'oauth.google.config'])

  // register a route that listens for the google oauth2 callback
  .config(function ($stateProvider) {
    $stateProvider.state('oauth_callback', {
      url: '/access_token=:accessToken',
      controller: function (googleapiJsClient) {
        googleapiJsClient.processTokenCallback();
      }
    });
  })

  .factory('googleapiJsClient', ['$http', '$q', '$rootScope', '$window', '$location', 'authConfig', function($http, $q, $rootScope, $window, $location, authConfig) {
    var params = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + obj[key]);
      }
      return p.join('&');
    };

    var authorize = function() {
        var deferred = $q.defer();

        /*jshint camelcase:false*/
        var authUrl = authConfig.auth_uri + '?' + params({
          client_id: authConfig.client_id,
          redirect_uri: authConfig.redirect_uris[0],
          response_type: 'token',
          scope: authConfig.scope
        });
        /*jshint camelcase:true*/
        $window.open(authUrl, '_blank', 'location=no,toolbar=no');

        angular.element($window).on('oauthcallback', function(event, data) {
          deferred.resolve(data);
        });

        return deferred.promise;
    };

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

    return {
      authorize: authorize,
      processTokenCallback: processTokenCallback
    };
  }]);

})(angular);
