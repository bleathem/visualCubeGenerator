'use strict';
var angular = require('angular');

require('angular');
require('raphael');
require('scramble_333');
require('scramble_222');
require('ng-fx');
require('./config.nogit.js');

require('./main/main.js');

require('vcg-http-helpers');

angular.module('visualCubeGenerator', [
  'ngFx',
  'ui.router',
  'http.helpers',
  'visualCubeGenerator.main',
  'visualCubeGenerator.config'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('visualCubeGenerator', {
      abstract: true,
      template: '<ui-view></ui-view>'
    });
});
