'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main', [
    'ui.router',
    'visualCubeGenerator.main.home',
    'visualCubeGenerator.main.solve.list',
    'visualCubeGenerator.main.solve.detail',
    'visualCubeGenerator.main.scramble.list',
    'visualCubeGenerator.main.scramble.detail',
    'visualCubeGenerator.main.account',
    'visualCubeGenerator.main.profile',
    'visualCubeGenerator.main.profile.solve'
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main', {
        abstract: true,
        templateUrl: 'app/main/main.tpl.html'
      });
  });
})(angular);
