(function (angular) {
  'use strict';
  angular.module('oauth.google', [])

  .factory('googleapi', ['$window', 'googleTokenPromise', function($window, googleTokenPromise) {
    var authorize = function() {
      var authUrl = 'http://home.bleathem.ca:9000/oauth/google';
      var authWindow = $window.open(authUrl, '_blank', 'location=no,toolbar=no');
      return googleTokenPromise(authWindow);
    };

    return {
      authorize: authorize
    };
  }])

  .factory('googleTokenPromise', ['$window', '$q', function($window, $q) {
    var getTokenPromiseJs = function(authWindow) {
      var deferred = $q.defer();
      angular.element(authWindow.opener).on('oauthcallback', function(event, params) {
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
  }])

  .directive('gPlusButton', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/oauth/google-sign-in.tpl.html'
    };
  }]);
})(angular);
