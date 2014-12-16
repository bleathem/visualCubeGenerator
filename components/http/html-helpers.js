'use strict';
(function (angular) {
  angular.module('html.helpers', [])

  .factory('confirm', function($window, $q) {
    var confirm = function(message) {
      var deferred = $q.defer();
      if ($window.confirm(message)) {
        deferred.resolve(true);
      } else {
        deferred.reject(false);
      }
      return deferred.promise;
    };
    return confirm;
  })

  .directive('twitterShare', function($timeout, $state) {
    return {
      scope: {
        solve: '=solve',
        user: '=user'
      },
      link: function($scope, element, attr) {
        $timeout(function() {
          twttr.widgets.createShareButton(
            attr.url,
            element[0],
            {
              count: 'none',
              text: attr.text,
              size: 'large'
            }
          );
        });
      }
    }
  })
  ;
})(angular);
