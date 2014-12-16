'use strict';
(function (angular) {
  angular.module('oauth.google', ['visualCubeGenerator.config'])

  .factory('googleapi', function($window, appConfig, googleTokenPromise) {
    var authorize = function() {
      var authUrl = appConfig.backend + '/api/oauth/google';
      var authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');
      return googleTokenPromise(authWindow);
    };

    return {
      authorize: authorize
    };
  })

  .factory('googleTokenPromise', function($window, $q, appConfig) {
    var getTokenPromiseJs = function(authWindow) {
      var deferred = $q.defer();
      angular.element(authWindow.opener).on('message', function(event) {
        if (event.origin !== appConfig.backend) {
          console.log('Ignoring message from unexpected origin.');
        }
        var params = event.data;
        if (params.user) {
          authWindow.close();
          deferred.resolve(JSON.parse(params.user));
        } else {
          authWindow.close();
          deferred.reject(new Error (params.error));
        }
      });
      return deferred.promise;
    };

    var getTokenPromiseInstalled = function(authWindow) {
      var deferred = $q.defer();
      angular.element(authWindow).on('loadstart', function(e) {
        var url = e.url;
        if (url.indexOf('/oauth/callback') === -1) {
          return;
        }
        var params = {};
        var queryString = url.split('?')[1];
        var regex = /([^&=]+)=([^&]*)/g, m;
        while ((m = regex.exec(queryString)) !== null) {
          params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        if (params.user) {
          authWindow.close();
          deferred.resolve(JSON.parse(params.user));
        } else if (params.error) {
          authWindow.close();
          deferred.reject(new Error(params.error));
        }
      });
      return deferred.promise;
    };

    return $window.cordova ? getTokenPromiseInstalled : getTokenPromiseJs;
  })

  .directive('gPlusButton', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        loggedIn: '=loggedIn'
      },
      templateUrl: 'oauth/google-sign-in.tpl.html'
    };
  })

  .directive('profile', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        profile: '=profile',
        click: '=ngClick',
      },
      templateUrl: 'oauth/google-profile.tpl.html'
    };
  });
})(angular);
