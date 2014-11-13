'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.solve', ['ui.router'])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.solve', {
        url: '/solve',
        templateUrl: 'app/solve/solve.tpl.html',
        controller: 'SolveController'
      });
  })

  .controller('SolveController', function ($scope, solveModel, solveManager) {
    $scope.solveModel = solveModel;
    $scope.delete = solveManager.delete;
  });
})(angular);
