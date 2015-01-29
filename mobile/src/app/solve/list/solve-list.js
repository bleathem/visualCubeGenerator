'use strict';
(function (angular) {
  angular.module('cube.solve.list', ['cube.solve.services'])

  .config(function($stateProvider) {
    $stateProvider
      .state('tab.solve-list', {
        url: '/solves',
        views: {
          'tab-solves': {
            templateUrl: 'app/solve/list/solve-list.tpl.html',
            controller: 'SolvesCtrl'
          }
        }
      });
    })

    .controller('SolvesCtrl', function ($scope, solveModel, solveManager) {
      $scope.solveModel = solveModel;
      $scope.delete = solveManager.delete;
    })
  ;
})(angular);
