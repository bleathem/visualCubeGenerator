(function (angular) {
  'use strict';
  angular.module('oauth.google', [
    'oauth.google.jsClient',
    'oauth.google.installedClient'
  ])

  .factory('googleapi', ['$http', '$window', 'googleAuthConfig', 'redirectUri', 'googleTokenPromise', function($http, $window, googleAuthConfig, redirectUri, googleTokenPromise) {
    var authConfig = googleAuthConfig;
    var params = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + obj[key]);
      }
      return p.join('&');
    };

    var authorize = function() {
      /*jshint camelcase:false*/
      var authUrl = authConfig.auth_uri + '?' + params({
        client_id: authConfig.client_id,
        redirect_uri: redirectUri,
        response_type: authConfig.response_type,
        scope: authConfig.scope
      });
      /*jshint camelcase:true*/
      var authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');
      return googleTokenPromise(authWindow);
    };

    return {
      authorize: authorize
    }
  }])

  .factory('googleTokenPromise', ['$window', 'googleTokenPromiseJs', 'googleTokenPromiseInstalled', function ($window, googleTokenPromiseJs, googleTokenPromiseInstalled) {
    var googleTokenPromise = $window.cordova ? googleTokenPromiseInstalled :googleTokenPromiseJs;
    return googleTokenPromise;
  }])

  .factory('googleAuthConfig', ['$window', 'jsClientConfig', 'installedClientConfig', function($window, jsClientConfig, installedClientConfig) {
    var googleAuthconfig = $window.cordova ? installedClientConfig : jsClientConfig;
    return googleAuthconfig;
  }])

  .factory('redirectUri', ['$window', 'appConfig', 'googleAuthConfig', function($window, appConfig, googleAuthConfig) {
    var redirectUri = googleAuthConfig.redirect_uris[0];
    if (!$window.cordova) {
      redirectUri = redirectUri + ':' + appConfig.port;
    }
    return redirectUri;
  }])

  .directive('gPlusButton', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/oauth/google-sign-in.tpl.html'
    };
  }]);
})(angular);
