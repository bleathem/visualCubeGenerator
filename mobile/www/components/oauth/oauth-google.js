(function (angular) {
  'use strict';
  angular.module('oauth.google', [
    'oauth.google.jsClient',
    'oauth.google.installedClient',
    'http.helpers'
  ])

  .constant('googleEndpoints', {
    tokenInfo: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
    openIdConnect: 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
    people: 'https://www.googleapis.com/plus/v1/people/me'
  })

  .factory('googleapi', [
    '$http',
    '$q',
    '$window',
    'serializeParameterObject',
    'googleapiInstalledClient',
    'googleapiJsClient',
    'googleEndpoints',

    function($http, $q, $window, serializeParameterObject, googleapiInstalledClient, googleapiJsClient, googleEndpoints) {
    var googleapi = $window.cordova ? googleapiInstalledClient : googleapiJsClient;
    var authConfig = googleapi.authConfig;

    var authorize = function() {
      /*jshint camelcase:false*/
      var authUrl = authConfig.auth_uri + '?' + serializeParameterObject({
        client_id: authConfig.client_id,
        redirect_uri: authConfig.redirect_uris[0],
        response_type: authConfig.response_type,
        approval_prompt: 'force',
        scope: 'openid'
      });
      /*jshint camelcase:true*/
      var authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');

      return googleapi.getTokenPromise(authWindow)
                      .then(getVerificationPromise)
                      .then(getTokenStoragePromise)
                      .then(getProfile)
                      .then(constructUser);
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
        url: googleEndpoints.tokenInfo,
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

    var getProfile = function(token) {
      var deferred = $q.defer();
      $http({
        method: 'get',
        url: googleEndpoints.openIdConnect,
        /*jshint camelcase:false*/
        params: {
          access_token: token.access_token
        }
        /*jshint camelcase:true*/
      }).then(function(response) {
        var googleAccount = response.data;
        googleAccount.token = token;
        deferred.resolve(googleAccount);
      }, function(response) {
        var message = '#' + response.status + ' - ' + response.statusText;
        deferred.reject(new Error(message));
      });
      return deferred.promise;
    };

    var constructUser = function(googleAccount) {
      var deferred = $q.defer();
      var user = {
        name: googleAccount.name,
        giveName: googleAccount.given_name,
        familyName: googleAccount.family_name
      };
      user.googleAccount = googleAccount;
      deferred.resolve(user);
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
