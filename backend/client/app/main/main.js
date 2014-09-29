(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main', ['ui.router', 'visualCubeGenerator.main.solve'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main', {
        abstract: true,
        templateUrl: 'app/main/main.tpl.html'
      });
  });
}(angular));
