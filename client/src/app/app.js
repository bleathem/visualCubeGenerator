'use strict';
(function (angular) {
  angular.module('visualCubeGenerator', [
    'ngFx',
    'ui.router',
    'http.helpers',
    'visualCubeGenerator.main',
    'visualCubeGenerator.config',
    'visualCubeGenerator.template'
  ])

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('visualCubeGenerator', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });
})(angular);
