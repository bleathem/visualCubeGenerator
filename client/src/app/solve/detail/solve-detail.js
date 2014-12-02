'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.solve.detail', ['ui.router', 'cube.scramble.services', 'cube.solve.services', 'timer'])

  .config(function ($stateProvider) {

    $stateProvider
      .state('visualCubeGenerator.main.solve-detail', {
        url: '/solve/:solveId',
        templateUrl: 'app/solve/detail/solve-detail.tpl.html',
        controller: 'SolveCtrl'
      });
  })

  .controller('SolveCtrl', function ($scope, $stateParams, solveModel, solveManager) {
    $scope.solve = solveModel.get($stateParams.solveId);
  })
  ;
})(angular);
