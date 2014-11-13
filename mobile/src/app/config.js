'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.config', [])

  .constant('appConfig', {
    backend: 'http://home.bleathem.ca:9000'
  });
})(angular);
