(function (angular) {
  'use strict';
  angular.module('oauth.google.installedClient', ['oauth.google.config', 'http.helpers'])

  .factory('googleapiInstalledClient', ['installedClientConfig', 'googleTokenPromiseInstalled', function(installedClientConfig, googleTokenPromiseInstalled) {
    return {
      authConfig: installedClientConfig,
      getTokenPromise: googleTokenPromiseInstalled,
    };
  }])

  .factory('googleTokenPromiseInstalled', ['$http', '$q', 'installedClientConfig', 'transformRequestAsFormPost', function($http, $q, installedClientConfig, transformRequestAsFormPost) {
    var authConfig = installedClientConfig;
    /** Get the access code from the google oauth2 provider **/
    var getCodePromise = function(authWindow) {
      var deferred = $q.defer();
      angular.element(authWindow).on('loadstart', function(e) {
        var url = e.url;
        var params = {};
        var queryString = url.split('?')[1];
        var regex = /([^&=]+)=([^&]*)/g, m;
        while ((m = regex.exec(queryString)) !== null) {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        if (params.code) {
          authWindow.close();
          deferred.resolve(params.code);
        } else if (params.error) {
          authWindow.close();
          deferred.reject(new Error(params.error));
        }
      });
      return deferred.promise;
    };

    /** Exchange the authorization code for an access token **/
    var getTokenPromise = function(code) {
      var deferred = $q.defer();
      /*jshint camelcase:false*/
      $http({
        method: 'post',
        transformRequest: transformRequestAsFormPost,
        url: authConfig.token_uri,
        data: {
          code: code,
          client_id: authConfig.client_id,
          client_secret: authConfig.client_secret,
          redirect_uri: authConfig.redirect_uris[0],
          grant_type: 'authorization_code'
        }
      /*jshint camelcase:true*/
      }).then(function(response) {
        deferred.resolve(response.data);
      }, function(response) {
        var message = '#' + response.status + ' - ' + response.statusText;
        deferred.reject(new Error(message));
      });
      return deferred.promise;
    };

    return function(authWindow) {
      return getCodePromise(authWindow).then(getTokenPromise);
    };
  }])
  ;
})(angular);
