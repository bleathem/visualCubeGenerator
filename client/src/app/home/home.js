'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.home', ['ui.router'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.home', {
        url: '/home',
        templateUrl: 'app/home/home.tpl.html',
        controller: 'HomeController'
      });
  })
  .controller('HomeController', function ($scope) {
    $scope.solves = [];
  });
})(angular);
