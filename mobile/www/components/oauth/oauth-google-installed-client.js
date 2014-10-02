/* global window:false */
(function (angular) {
  'use strict';
  angular.module('oauth.google.installedClient', ['oauth.google.config'])

  .factory('googleapi', ['$http', '$q', 'authConfig', 'transformRequestAsFormPost', function($http, $q, authConfig, transformRequestAsFormPost) {
    var params = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
        p.push(key + '=' + obj[key]);
      }
      return p.join('&');
    };

    var authorize = function() {
        var deferred = $q.defer();

        //Build the OAuth consent page URL
        /*jshint camelcase:false*/
        var authUrl = authConfig.auth_uri + '?' + params({
          client_id: authConfig.client_id,
          redirect_uri: authConfig.redirect_uris[0],
          response_type: authConfig.response_type,
          scope: authConfig.scope
        });
        /*jshint camelcase:true*/
        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        //Pass a bogus redirect_uri of 'http://localhost', which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        angular.element(authWindow).on('loadstart', function(e) {
            var url = e.url;
            var params = {};
            var queryString = url.split('?')[1];
            var regex = /([^&=]+)=([^&]*)/g, m;
            while ((m = regex.exec(queryString)) !== null) {
              params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }

            if (params.code || params.error) {
              authWindow.close();
            }

            if (params.code) {
                //Exchange the authorization code for an access token
                $http({
                  method: 'post',
                  transformRequest: transformRequestAsFormPost,
                  /*jshint camelcase:false*/
                  url: authConfig.token_uri,
                  data: {
                    code: params.code,
                    client_id: authConfig.client_id,
                    client_secret: authConfig.client_secret,
                    redirect_uri: authConfig.redirect_uris[0],
                    grant_type: 'authorization_code'
                  }
                  /*jshint camelcase:true*/
                }).success(function(data) {
                    deferred.resolve(data);
                }).error(function(data) {
                    authWindow.close();
                    deferred.reject(data);
                });
            } else if (params.error) {
                //The user denied access to the app
                authWindow.close();
                deferred.reject({
                    error: params.error
                });
            }
        });

        return deferred.promise;
    };
    return {
      authorize: authorize
    };
  }])

  .factory('transformRequestAsFormPost', function() {
    function serializeData( data ) {

        // If this is not an object, defer to native stringification.
        if ( ! angular.isObject( data ) ) {
            return( ( data === null ) ? '' : data.toString() );
        }
        var buffer = [];
        // Serialize each key in the object.
        for ( var name in data ) {
            if ( ! data.hasOwnProperty( name ) ) {
                continue;
            }
            var value = data[ name ];
            buffer.push(
                encodeURIComponent( name ) +
                '=' +
                encodeURIComponent( ( value === null ) ? '' : value )
            );
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer
            .join( '&' )
            .replace( /%20/g, '+' )
        ;
        return( source );
    }

    function transformRequest( data, getHeaders ) {
        var headers = getHeaders();
        headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded; charset=utf-8';
        return( serializeData( data ) );
    }

    return( transformRequest );

  });
})(angular);
