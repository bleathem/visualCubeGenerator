'use strict';
(function (angular) {
  angular.module('http.helpers', ['oauth'])

  /** From http://engineering.talis.com/articles/elegant-api-auth-angular-js/ **/
  .run(function($injector, auth) {
    console.log('Registering Bearer token transformRequest');
    $injector.get('$http').defaults.transformRequest = function(data, headersGetter) {
      if (auth && auth.user) {
        /*jshint -W069 */
        /*jshint camelcase: false */
        headersGetter()['Authorization'] = 'Bearer '+auth.user.googleAccount.token[0].access_token;
        /*jshint +W069 */
        /*jshint camelcase: true */
      }
      if (data) {
          return angular.toJson(data);
      }
    };
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function ($q, auth) {
      return {
        responseError: function(rejection) {
          if (rejection.status === 401) {
            console.log('Unauthorized http reqeust, logging out.');
            auth.logout();
          }
          return $q.reject(rejection);
        }
      };
    });
  })

  /** From http://www.bennadel.com/blog/2615-posting-form-data-with-http-in-angularjs.htm **/
  .factory('serializeParameterObject', function() {
    function serializeData(data) {

        // If this is not an object, defer to native stringification.
        if (!angular.isObject(data)) {
            return((data === null) ? '' : data.toString());
        }
        // Serialize each key in the object.
        var buffer = [];
        for (var name in data) {
            if (! data.hasOwnProperty(name)) {
                continue;
            }
            var value = data[name];
            buffer.push(
                encodeURIComponent(name) +
                '=' +
                encodeURIComponent((value === null) ? '' : value)
            );
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer.join('&').replace(/%20/g, '+');
        return(source);
    }

    return serializeData;
  })

  .factory('transformRequestAsFormPost', function(serializeParameterObject) {
    function transformRequest(data, getHeaders) {
        var headers = getHeaders();
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        return( serializeParameterObject(data) );
    }

    return transformRequest;
  })

  .service('bewit', function($http, $q, appConfig, auth) {
    return {
      getBewitCode: function() {
        var deferred = $q.defer();
        if (!auth.user) {
          deferred.reject(new Error('User not logged in'));
          return deferred.promise;
        }
        var url = appConfig.backend + '/api/bewit/code';
        $http({
          method: 'get',
          url: url
        }).then(function(response) {
            deferred.resolve(response.data);
          }, function(response) {
            var message = '#' + response.status + ' - ' + response.statusText;
            deferred.reject(new Error(message));
          });
        return deferred.promise;
      }
    };
  })

  ;

})(angular);
