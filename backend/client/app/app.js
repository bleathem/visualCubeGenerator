(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator', [
    'ngFx',
    'ui.router',
    'visualCubeGenerator.main',
    'visualCubeGenerator.main.home',
    'visualCubeGenerator.main.solve',
    'visualCubeGenerator.main.scramble'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/scrambles');

    $stateProvider
      .state('visualCubeGenerator', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });

}(angular));
