'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main', [
    'ui.router',
    'visualCubeGenerator.main.home',
    'visualCubeGenerator.main.solve',
    'visualCubeGenerator.main.scrambles',
    'visualCubeGenerator.main.scramble.detail',
    'visualCubeGenerator.main.account'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main', {
        abstract: true,
        templateUrl: 'app/main/main.tpl.html'
      });
  });
})(angular);