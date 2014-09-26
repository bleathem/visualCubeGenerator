(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator', [
    'ngFx',
    'ui.router',
    'visualCubeGenerator.main'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/visualCubeGenerator/main/solve');

    $stateProvider
      .state('visualCubeGenerator', {
        url: '/visualCubeGenerator',
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });

}(angular));
