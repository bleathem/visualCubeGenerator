'use strict';
(function (angular) {
  angular.module('visualCubeGenerator.main.solve.list', ['ui.router'])

  .config(function ($stateProvider) {
    $stateProvider
      .state('visualCubeGenerator.main.solve-list', {
        url: '/solves',
        templateUrl: 'app/solve/list/solve-list.tpl.html',
        controller: 'SolveListController'
      });
  })

  .controller('SolveListController', function ($scope, solveModel, synchSolves, auth) {
    $scope.auth = auth;
    $scope.synchSolves = synchSolves;
    $scope.solveModel = solveModel;
  })

  .directive('solveStatistics', function() {
    return {
      templateUrl: 'app/solve/list/statistics.tpl.html',
      scope: {
        averages: '=averages',
        uistate: '=uistate',
        userid: '=userid'
      }
    }
  });
})(angular);
