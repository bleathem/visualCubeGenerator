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
  ;
})(angular);
