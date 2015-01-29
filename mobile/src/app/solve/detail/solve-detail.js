'use strict';
(function (angular) {
  angular.module('cube.solve.detail', [
    'cube.solve.services',
    'html.helpers'
  ])

  .config(function($stateProvider) {
    $stateProvider
      .state('tab.solve-detail', {
        url: '/solve/:solveId',
        views: {
          'tab-solves': {
            templateUrl: 'app/solve/detail/solve-detail.tpl.html',
            controller: 'SolveCtrl'
          }
        }
      });
    })

    .controller('SolveCtrl', function ($scope, $state, $stateParams, solveModel, solveManager, confirm) {
      $scope.solve = solveModel.get($stateParams.solveId);
      $scope.deleteSolve = function(solve) {
        confirm('Are you sure you want to delete this solve?')
          .then(solveManager.deleteSolve(solve))
          .then(function() {
            $state.go('tab.solve-list');
          });
      };
    })
  ;
})(angular);
