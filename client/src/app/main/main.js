'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main', [
    'ui.router',
    'visualCubeGenerator.main.home',
    'visualCubeGenerator.main.solve.list',
    'visualCubeGenerator.main.solve.detail',
    'visualCubeGenerator.main.scramble.list',
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
