(function (angular) {
  'use strict';

  angular.module('visualCubeGenerator', [
    'ngFx',
    'ui.router',
    'http.helpers',
    'visualCubeGenerator.main'
  ])

  .constant('appConfig', {
    port: 9000
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('visualCubeGenerator', {
        abstract: true,
        template: '<ui-view></ui-view>'
      });
  });

}(angular));
