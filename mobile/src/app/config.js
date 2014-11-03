'use strict';
var angular = require('angular');

angular.module('visualCubeGenerator.config', [])

.constant('appConfig', {
  backend: 'http://home.bleathem.ca:9000'
});
