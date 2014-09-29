(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator', [
    'ngFx',
    'ui.router',
    'visualCubeGenerator.main',
    'visualCubeGenerator.main.home',
    'visualCubeGenerator.main.solve',
    'visualCubeGenerator.main.scrambles',
    'visualCubeGenerator.main.scramble.detail'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('visualCubeGenerator', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });

}(angular));
