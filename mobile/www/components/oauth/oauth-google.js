(function (angular) {
  'use strict';
  angular.module('oauth.google', [
    'oauth.google.jsClient',
    'oauth.google.installedClient'
  ])

  .factory('googleapi', ['$http', '$window', 'googleapiInstalledClient', 'googleapiJsClient', function($http, $window, googleapiInstalledClient, googleapiJsClient) {
    var googleapi = $window.cordova ? googleapiInstalledClient : googleapiJsClient;
    var authConfig = googleapi.authConfig;
    var redirectUri = googleapi.redirectUri;

    /** A helper fucntion to convert an object to a paramerter list **/
    var objecttoParams = function(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + obj[key]);
      }
      return p.join('&');
    };

    var authorize = function() {
      /*jshint camelcase:false*/
      var authUrl = authConfig.auth_uri + '?' + objecttoParams({
        client_id: authConfig.client_id,
        redirect_uri: redirectUri,
        response_type: authConfig.response_type,
        scope: authConfig.scope
      });
      /*jshint camelcase:true*/
      var authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');
      return googleapi.getTokenPromise(authWindow);
    };

    return {
      authorize: authorize
    }
  }])

  .directive('gPlusButton', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/oauth/google-sign-in.tpl.html'
    };
  }]);
})(angular);
