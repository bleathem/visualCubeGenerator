(function (angular) {
  'use strict';
  angular.module('visualCubeGenerator.main', ['ngRoute', 'visualCubeGenerator.main.solve'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main/main.tpl.html',
        controller: 'MainController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('MainController', function ($scope) {
    $scope.things = [];
  });
}(angular));
