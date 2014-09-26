(function (angular) {
  'use strict';angular.module('visualCubeGenerator.main.solve', ['ngRoute'])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/solves', {
        templateUrl: 'solve/solve.tpl.html',
        controller: 'SolveController'
      });
  })

  .controller('SolveController', function ($scope) {
    $scope.solves = [];
  });

})(angular);
