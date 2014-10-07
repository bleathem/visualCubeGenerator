(function (angular) {
  'use strict';
  angular.module('oauth.google', [
    'oauth.google.jsClient',
    'oauth.google.installedClient'
  ])

  .factory('googleapi', ['$http', '$q', '$window', 'googleapiInstalledClient', 'googleapiJsClient', function($http, $q, $window, googleapiInstalledClient, googleapiJsClient) {
    var googleapi = $window.cordova ? googleapiInstalledClient : googleapiJsClient;
    var authConfig = googleapi.authConfig;

    /** A helper fucntion to convert an object to a paramerter list **/
    var objectToParams = function(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + obj[key]);
      }
      return p.join('&');
    };

    var authorize = function() {
      /*jshint camelcase:false*/
      var authUrl = authConfig.auth_uri + '?' + objectToParams({
        client_id: authConfig.client_id,
        redirect_uri: authConfig.redirect_uris[0],
        response_type: authConfig.response_type,
        scope: authConfig.scope
      });
      /*jshint camelcase:true*/
      var authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');

      return googleapi.getTokenPromise(authWindow)
                      .then(getVerificationPromise)
                      .then(getTokenStoragePromise);
    };

    var getTokenStoragePromise = function(data) {
      var deferred = $q.defer();
      console.log('validated token received, save it to storage here');
      deferred.resolve(data);
      return deferred.promise;
    };

    var getVerificationPromise = function(token) {
      var deferred = $q.defer();
      /*jshint camelcase:false*/
      $http({
        method: 'get',
        url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
        params: {
          access_token: token.access_token
        }
      }).then(function(response) {
        var validation = response.data;
        if (validation.issued_to === authConfig.client_id) {
          deferred.resolve(token);
        } else {
          deferred.reject(new Error('Token issuer does not match our client_id'));
        }
      }, function(response) {
        var message = '#' + response.status + ' - ' + response.statusText;
        deferred.reject(new Error(message));
      });
      /*jshint camelcase:true*/
      return deferred.promise;
    };

    return {
      authorize: authorize
    };
  }])

  .directive('gPlusButton', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/oauth/google-sign-in.tpl.html'
    };
  }]);
})(angular);
