(function (angular) {
  'use strict';
  angular.module('http.helpers', ['oauth.google'])

  /** From http://engineering.talis.com/articles/elegant-api-auth-angular-js/ **/
  .run(['$injector', 'auth', function($injector, auth) {
    console.log('Registering Bearer token transformRequest');
    $injector.get('$http').defaults.transformRequest = function(data, headersGetter) {
      if (auth && auth.user) {
        headersGetter()['Authorization'] = 'Bearer '+auth.user.googleAccount.token[0].access_token;
      }
      if (data) {
          return angular.toJson(data);
      }
    };
  }])

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

  .factory('transformRequestAsFormPost', ['serializeParameterObject', function(serializeParameterObject) {
    function transformRequest(data, getHeaders) {
        var headers = getHeaders();
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        return( serializeParameterObject(data) );
    }

    return transformRequest;
  }]);
})(angular);
